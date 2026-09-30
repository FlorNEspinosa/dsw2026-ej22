const StorageManager = {
    key: 'specialties',

    init: function() {
        if (!localStorage.getItem(this.key)) {
            localStorage.setItem(this.key, JSON.stringify([]));
        }
    },

    getSpecialties: function() {
        this.init();
        return JSON.parse(localStorage.getItem(this.key));
    },

    addSpecialty: function(specialty) {
        const specialties = this.getSpecialties();
        specialties.push(specialty);
        localStorage.setItem(this.key, JSON.stringify(specialties));
    }
};

// Se ejecuta al cargar el script para garantizar que el array exista
StorageManager.init();