import { useMemo } from "react";
import { createAvatar } from "@dicebear/core";
import { funEmoji } from "@dicebear/collection";
import { Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { AvatarOption, FunEmojiEyes, FunEmojiMouth, FunEmojiSchema } from "@/shared/types/avatar.types";

// SelectAvatar.tsx
interface SelectAvatarProps {
  value: { eyes: FunEmojiEyes; mouth: FunEmojiMouth };
  onChange: (value: { eyes: FunEmojiEyes; mouth: FunEmojiMouth }) => void;
}

export const SelectAvatar = ({ value, onChange }: SelectAvatarProps) => {
  const schema = funEmoji.schema as FunEmojiSchema;

  const currentAvatar = useMemo(() => {
    return createAvatar(funEmoji, {
      size: 144,
      eyes: [value.eyes],
      mouth: [value.mouth],
      backgroundColor: ["94a3b8"],
    }).toDataUri();
  }, [value]);

  const options = useMemo<AvatarOption[]>(() => {
    const eyes = schema.properties?.eyes?.items?.enum ?? [];
    const mouths = schema.properties?.mouth?.items?.enum ?? [];
    return eyes.flatMap((eye) =>
      mouths.map((mouth) => ({
        id: `${eye}-${mouth}`,
        eyes: eye,
        mouth,
        dataUri: createAvatar(funEmoji, { size: 96, eyes: [eye], mouth: [mouth], backgroundColor: ["94a3b8"] }).toDataUri(),
      }))
    );
  }, [schema]);

  return (
    <div className="flex flex-col items-center gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <button
            type="button"
            className="relative inline-flex h-20 w-20 items-center justify-center rounded-full border border-slate-300 bg-slate-100 shadow-sm hover:ring-2 hover:ring-blue-400 transition focus:outline-none"
          >
            <img src={ currentAvatar } alt="Avatar seleccionado" className="h-full w-full rounded-full object-cover" />
            <span className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-white border border-slate-300">
              <Pencil className="h-4 w-4 text-slate-700" />
            </span>
          </button>
        </DialogTrigger>

        <DialogContent className="w-[400px] max-h-[60vh] overflow-y-auto rounded-xl border bg-white p-4 shadow-lg">
          <p className="text-sm font-semibold mb-4 text-slate-800">Selecciona tu avatar</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            { options.map((option) => {
              const isActive = value.eyes === option.eyes && value.mouth === option.mouth;
              return (
                <button
                  key={ option.id }
                  type="button"
                  onClick={ () => onChange({ eyes: option.eyes, mouth: option.mouth }) }
                  className={ cn(
                    "relative rounded-xl border transition p-2 focus:outline-none",
                    isActive ? "border-blue-500 ring-2 ring-blue-400" : "border-transparent hover:border-slate-200 hover:shadow-sm"
                  ) }
                >
                  <img src={ option.dataUri } alt={ `${option.eyes}-${option.mouth}` } className="h-16 w-16 mx-auto object-contain" />
                </button>
              );
            }) }
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};