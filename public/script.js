document.addEventListener('DOMContentLoaded', () => {
    loadGames();
    document.getElementById('add-game-button').addEventListener('click', toggleAddGameForm);
    document.getElementById('game-form').addEventListener('submit', handleFormSubmit);
});

async function loadGames() {
    try {
        const response = await fetch('/api/games');
        const games = await response.json();
        displayGames(games);
    } catch (error) {
        console.error('Error loading games:', error);
    }
}

function displayGames(games) {
    const gameList = document.getElementById('game-list');
    gameList.innerHTML = '';
    games.forEach(game => {
        const gameElement = document.createElement('section');
        gameElement.classList.add('game');
        let mapsList = game.maps.join(', ');
        gameElement.innerHTML = `
            <h3>${game.title}</h3>
            <p><strong>Genre:</strong> ${game.genre}</p>
            <p><strong>Main Platform:</strong> ${game.mainPlatform}</p>
            <p><strong>Series Number:</strong> ${game.seriesNumber}</p>
            <p><strong>Release Year:</strong> ${game.releaseYear}</p>
            <p><strong>Timeframe:</strong> ${game.timeframe}</p>
            <p><strong>Maps:</strong> ${mapsList}</p>
            <button onclick="editGame(${game._id})">Edit</button>
            <button onclick="deleteGame(${game._id})">Delete</button>
        `;
        gameList.appendChild(gameElement);
    });
}

function toggleAddGameForm() {
    const formContainer = document.getElementById('game-form-container');
    formContainer.classList.toggle('hidden');
}

async function handleFormSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const maps = formData.get('maps').split(',').map(map => map.trim());

    const newGame = {
        title: formData.get('title'),
        genre: formData.get('genre'),
        mainPlatform: formData.get('mainPlatform'),
        seriesNumber: formData.get('seriesNumber'),
        releaseYear: formData.get('releaseYear'),
        timeframe: formData.get('timeframe'),
        maps: maps,
    };

    try {
        const response = await fetch('/api/games', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newGame)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        displayGames(result);
        toggleAddGameForm();
        event.target.reset();
    } catch (error) {
        console.error('Error submitting form:', error);
    }
}


const validateGame = (game) => {
    const schema = Joi.object({
        _id: Joi.allow(""),
        title: Joi.string().min(3).required(),
        genre: Joi.string().min(3).required(),
        mainPlatform: Joi.string().min(3).required(),
        seriesNumber: Joi.number().integer().min(1).required(),
        releaseYear: Joi.number().integer().min(1900).max(new Date().getFullYear()).required(),
        timeframe: Joi.string().min(3).required(),
        maps: Joi.allow("")
    });

    return schema.validate(game);
};

async function editGame(gameId) {
    try {
        const response = await fetch(`/api/games/${gameId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const gameToEdit = await response.json();

        document.getElementById('title').value = gameToEdit.title;
        document.getElementById('genre').value = gameToEdit.genre;
        document.getElementById('mainPlatform').value = gameToEdit.mainPlatform;
        document.getElementById('seriesNumber').value = gameToEdit.seriesNumber;
        document.getElementById('releaseYear').value = gameToEdit.releaseYear;
        document.getElementById('timeframe').value = gameToEdit.timeframe;
        document.getElementById('maps').value = gameToEdit.maps.join(', ');

        document.getElementById('game-form-container').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Error editing game:', error);
    }
}

async function deleteGame(gameId) {
    if (confirm('Are you sure you want to delete this game?')) {
        try {
            const response = await fetch(`/api/games/${gameId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            displayGames(result);
        } catch (error) {
            console.error('Error deleting game:', error);
        }
    }
}
