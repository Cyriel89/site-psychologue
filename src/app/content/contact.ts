export const contactContent = {
    title: "Contact",
    form: {
        name: {
            label: "Nom & Prénom",
            type: "text",
            required: true
        },
        email: {
            label: "Adresse e-mail",
            type: "email",
            required: true
        },
        subject: {
            label: "Sujet",
            type: "text",
            required: false
        },
        message: {
            label: "Message",
            type: "textarea",
            rows: 5,
            required: true
        },
        rgpd: {
            label: "J’accepte le traitement de mes données conformément à la politique de confidentialité.",
            type: "checkbox",
            required: true
        }
    },
    submitButtonText: "Envoyer",
    infoBox: {
        title: "Informations utiles",
        items: [
            { icon: "📍", text: "Adresse : 1 rue Exemple, 44000 Nantes" },
            { icon: "📆", text: "Horaires : lundi au vendredi, 9h - 18h" },
            { icon: "📧", text: "Email : contact@contact.com"}
        ]
    }
}