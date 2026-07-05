# Cooked - Piattaforma di Ispirazione Culinaria

Progetto finale sviluppato per l'esame di **Informatica II** presso l'**Università di Trento** (Dipartimento di Psicologia e Scienze Cognitive).

##  Membri del Gruppo
- **Leonardo Mora Larentis**
- **Alessandro Ohmstede**
- **Yannick David Hadzi**

##  Credenziali di Accesso Rapido (Test)
Per facilitare la fase di correzione e valutazione da parte del docente, è stato predisposto un account di test già registrato e configurato nel database Firebase:
- **Email:** `noi@unitn.it`
- **Password:** `654321`

---

## Descrizione del Progetto
*Cooked* è una piattaforma web interattiva e responsive dedicata alla ricerca e alla gestione di ricette culinarie. L'applicazione permette agli utenti di registrarsi, autenticarsi in modo sicuro, cercare ispirazioni gastronomiche in tempo reale, consultare dettagli avanzati su ingredienti e preparazioni, e salvare i propri piatti preferiti in un'area personale personalizzabile.

## 🛠️ Architettura e Tecnologie Utilizzate
Il software è stato è sviluppato tramite:

- **Frontend Framework:** Vue 3
- **Stile & Responsiveness:** Bootstrap 5, sfruttando il sistema di griglie fluide 

- **Firebase**:
  - *Firebase Authentication:* per la registrazione e il login sicuro degli account.
  - *Cloud Firestore:* per il salvataggio in tempo reale dei dati di profilo e degli array dei preferiti di ciascun utente.
- **Integrazione API:** Connessione asincrona ad un'API esterna (*Spoonacular API*) per il recupero delle ricette. 
- **Accessibilità (WAI-ARIA):** Implementazione nativa di attributi per l'accessibilità da parte di utenti non vedenti tramite Screen Reader.

---

## Istruzioni per l'Avvio in Locale

Per eseguire il progetto sul proprio computer, assicurarsi di avere installato [Node.js](https://nodejs.org/) e procedere come segue:

### 1. Installazione delle dipendenze
Aprire il terminale all'interno della cartella principale del progetto e lanciare il comando per scaricare i pacchetti necessari:
```bash
npm install