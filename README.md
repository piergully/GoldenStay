## ⚙️ Configurazione del Database

Per motivi di sicurezza, il file con le credenziali del database (`application.properties`) non è incluso nel repository.
È presente invece un file di template chiamato `application.properties.example`.

### Procedura di avvio:

1.  **Crea il Database:**
    Assicurati di avere un database PostgreSQL vuoto chiamato `goldenstay_db`.
    ```sql
    CREATE DATABASE goldenstay_db;
    ```

2.  **Configura le Credenziali:**
    * Vai nella cartella `src/main/resources`.
    * Crea una copia del file `application.properties.example`.
    * Rinomina la copia in **`application.properties`**.
    * Apri il file e inserisci il tuo username e la tua password di PostgreSQL al posto dei segnaposto.

    Esempio di configurazione finale:
    ```properties
    spring.datasource.url=jdbc:postgresql://localhost:5432/goldenstay_db
    spring.datasource.username=postgres
    spring.datasource.password=LA_TUA_PASSWORD_QUI
    ```

3.  **Avvia il Backend:**
    Una volta configurato il file, esegui il progetto. Hibernate creerà automaticamente le tabelle necessarie.
4.  **Pattern Utilizzati**
    - Strategy (../frontend/.../app/core/strategies), calcolo prezzi per ogni tipo di stanza.
    - Factory (../backend/.../factory), creazione di oggetti di tipo Stanza.

