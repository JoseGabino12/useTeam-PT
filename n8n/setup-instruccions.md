# 📬 Workflow Setup Instructions

## 🧠 Overview
This workflow automates the process of exporting board data as a CSV file and sending it via email using Gmail SMTP.

- **Workflow name:** Backlog Export
- **File:** `workflow.json`
- **Automation platform:** n8n
- **Main steps:**
  1. Fetch board details from the API.
  2. Convert board data into CSV format.
  3. Send the CSV file as an email attachment using Gmail SMTP.

---

## ⚙️ Requirements

Before importing and running the workflow, make sure you have:

1. **n8n installed and running**
   ```bash
   npm install -g n8n

    n8n start
    ```
    or via Docker:
    ```bash
    docker run -it --rm \
    -p 5678:5678 \
    -v ~/.n8n:/home/node/.n8n \
    n8nio/n8n
    ```
2. **A valid Gmail App Password**
	- Enable 2-Step Verification on your Google Account.
	- Generate an App Password here: https://myaccount.google.com/apppasswords.
	- Use that 16-character password in your n8n Gmail SMTP credential.
3. **Your workflow file (workflow.json)**
   - Import it into n8n.

---
## 🚀 Setup Instructions
1. **Import the workflow**
   - Open n8n in your browser (default: http://localhost:5678).
   - Click on "Import" and upload the `Export-Backlog-CSV.json` file.
2. **Create the Gmail credential**
    - Go to "Credentials" in n8n.
    - Create a new credential of type "Gmail SMTP".
    - Host should be `smtp.gmail.com` and Port `465`.
    - Set "SSL/TLS" to true.
    - Fill in your Gmail email and the App Password you generated.
    - Save the credential.
3. **Update email sender**
  - In the Send Email node:
	  - From Email: your Gmail address
	  - Credential to connect with: your Gmail SMTP credential

4. **Run the workflow**
  - When executed:
    - It fetches the board data.
    - Generates a CSV file dynamically.
    - Sends it as an attachment to the board creator (createdBy.email).

## Output
You’ll receive an email like:

Subject: Backlog Export – backlog_Marketing.csv
Body:
Hola 👋
Adjunto encontrarás el archivo CSV con el backlog exportado del tablero.
Saludos,
Gabino
Attachment: backlog_Marketing.csv