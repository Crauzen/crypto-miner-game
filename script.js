// Variables du jeu
let cryptoCount = 0;
let cryptoPerClick = 1;
let cryptoPerSecond = 0;
let cryptoValue = 100;
let prestigePoints = 0;
let prestigeBonus = 0;

let experience = 0;
let level = 1;
let experienceToNextLevel = 100;

let energy = 100;
let maxEnergy = 100;
let energyPerSecond = 5;

let balance = 1000;
let portfolio = {};

let cryptocurrencies = [
    { name: "Bitcoin", baseValue: 100, volatility: 0.05, marketPrice: 100 },
    { name: "Ethereum", baseValue: 50, volatility: 0.1, marketPrice: 50 },
    { name: "Litecoin", baseValue: 25, volatility: 0.15, marketPrice: 25 },
    { name: "Ripple", baseValue: 20, volatility: 0.2, marketPrice: 20 },
    { name: "Dogecoin", baseValue: 10, volatility: 0.25, marketPrice: 10 }
];
let currentCrypto = cryptocurrencies[0];

let achievements = [
    { name: "Premier Miner", condition: () => cryptoCount >= 1, unlocked: false },
    { name: "Mineur Novice", condition: () => cryptoCount >= 100, unlocked: false },
    { name: "Mineur Expert", condition: () => cryptoCount >= 1000, unlocked: false },
    { name: "Mineur Légendaire", condition: () => cryptoCount >= 10000, unlocked: false },
    { name: "Investisseur", condition: () => cryptoValue >= 150, unlocked: false }
];

let dailyQuest = {
    description: "",
    condition: null,
    reward: 0,
    completed: false
};

let researches = [
    { name: "Algorithmes Optimisés", cost: 500, time: 60, effect: () => { cryptoPerClick *= 1.5; }, unlocked: false },
    { name: "Matériel Avancé", cost: 1000, time: 120, effect: () => { cryptoPerSecond *= 2; }, unlocked: false },
    { name: "Intelligence Artificielle", cost: 5000, time: 300, effect: () => { prestigeBonus += 0.1; }, unlocked: false }
];

let currentResearch = null;
let researchTimeLeft = 0;

let quests = [
    {
        name: "Début de l'Aventure",
        description: "Minez 100 cryptomonnaies.",
        condition: () => cryptoCount >= 100,
        reward: () => { balance += 200; },
        accepted: false,
        completed: false
    },
    {
        name: "Investisseur Averti",
        description: "Possédez 5 Bitcoin.",
        condition: () => (portfolio['Bitcoin'] || 0) >= 5,
        reward: () => { cryptoPerSecond += 5; },
        accepted: false,
        completed: false
    }
];

let currentQuest = null;

// Éléments du DOM
const cryptoCountEl = document.getElementById('crypto-count');
const cryptoPerSecondEl = document.getElementById('crypto-per-second');
const cryptoValueEl = document.getElementById('crypto-value');
const prestigePointsEl = document.getElementById('prestige-points');
const levelEl = document.getElementById('level');
const experienceEl = document.getElementById('experience');
const experienceToNextLevelEl = document.getElementById('experience-to-next-level');
const energyEl = document.getElementById('energy');
const maxEnergyEl = document.getElementById('max-energy');

const mineButton = document.getElementById('mine-button');
const upgradeClickButton = document.getElementById('upgrade-click');
const autoMineButton = document.getElementById('auto-mine');
const buyFarmButton = document.getElementById('buy-farm');
const buyDataCenterButton = document.getElementById('buy-datacenter');
const joinPoolButton = document.getElementById('join-pool');
const buyGeneratorButton = document.getElementById('buy-generator');
const prestigeButton = document.getElementById('prestige-button');
const saveGameButton = document.getElementById('save-game');
const resetGameButton = document.getElementById('reset-game');

const achievementsListEl = document.getElementById('achievements-list');
const dailyQuestEl = document.getElementById('daily-quest');
const cryptoSelectEl = document.getElementById('crypto-select');
const languageDropdown = document.getElementById('language-dropdown');
const themeDropdown = document.getElementById('theme-dropdown');
const backgroundMusic = document.getElementById('background-music');

const balanceEl = document.getElementById('balance');
const marketTableEl = document.getElementById('market-table');

const researchNameEl = document.getElementById('research-name');
const startResearchButton = document.getElementById('start-research-button');

const questNameEl = document.getElementById('quest-name');
const acceptQuestButton = document.getElementById('accept-quest-button');

let ctx = document.getElementById('cryptoChart').getContext('2d');
let cryptoChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Cryptomonnaies Minées',
            data: [],
            backgroundColor: 'rgba(255, 193, 7, 0.2)',
            borderColor: 'rgba(255, 193, 7, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            x: { display: false },
            y: { beginAtZero: true }
        }
    }
});

let texts = {
    fr: {
        gameTitle: "💰 Mineur de Cryptomonnaies 💰",
        statsTitle: "Statistiques",
        cryptoCountText: "Cryptomonnaies minées :",
        cryptoPerSecondText: "Cryptomonnaies par seconde :",
        cryptoValueText: "Valeur actuelle de la cryptomonnaie : $",
        prestigePointsText: "Points de Prestige :",
        levelText: "Niveau :",
        experienceText: "XP :",
        energyText: "Énergie :",
        selectCryptoTitle: "Sélectionnez une Cryptomonnaie",
        mineButtonText: "Miner",
        upgradesTitle: "Améliorations",
        upgradeClickText: "Améliorer Minage par Clic (Coût : 10)",
        autoMineText: "Acheter Mineur Automatique (Coût : 100)",
        buyFarmText: "Acheter Ferme de Minage (Coût : 500)",
        buyDataCenterText: "Acheter Centre de Données (Coût : 2000)",
        joinPoolText: "Rejoindre un Pool de Minage (Coût : 5000)",
        buyGeneratorText: "Acheter Générateur (Coût : 200)",
        dailyQuestTitle: "Mission Quotidienne",
        achievementsTitle: "Succès Débloqués",
        optionsTitle: "Options",
        prestigeButtonText: "Prestige (Réinitialiser pour gagner des PP)",
        saveGameText: "Sauvegarder le Jeu",
        resetGameText: "Réinitialiser le Jeu",
        statsGraphTitle: "Graphique de Progression",
        marketTitle: "Marché Boursier",
        playerBalance: "Balance : $",
        researchTitle: "Recherche et Développement",
        currentResearch: "Recherche en cours :",
        startResearchButton: "Commencer une Recherche",
        questsTitle: "Quêtes",
        currentQuest: "Quête en cours :",
        acceptQuestButton: "Accepter une Quête"
    },
    en: {
        gameTitle: "💰 Cryptocurrency Miner 💰",
        statsTitle: "Statistics",
        cryptoCountText: "Mined Cryptocurrencies:",
        cryptoPerSecondText: "Cryptocurrencies per second:",
        cryptoValueText: "Current Cryptocurrency Value: $",
        prestigePointsText: "Prestige Points:",
        levelText: "Level:",
        experienceText: "XP:",
        energyText: "Energy:",
        selectCryptoTitle: "Select a Cryptocurrency",
        mineButtonText: "Mine",
        upgradesTitle: "Upgrades",
        upgradeClickText: "Upgrade Click Mining (Cost: 10)",
        autoMineText: "Buy Automatic Miner (Cost: 100)",
        buyFarmText: "Buy Mining Farm (Cost: 500)",
        buyDataCenterText: "Buy Data Center (Cost: 2000)",
        joinPoolText: "Join Mining Pool (Cost: 5000)",
        buyGeneratorText: "Buy Generator (Cost: 200)",
        dailyQuestTitle: "Daily Quest",
        achievementsTitle: "Unlocked Achievements",
        optionsTitle: "Options",
        prestigeButtonText: "Prestige (Reset to gain PP)",
        saveGameText: "Save Game",
        resetGameText: "Reset Game",
        statsGraphTitle: "Progress Chart",
        marketTitle: "Stock Market",
        playerBalance: "Balance: $",
        researchTitle: "Research and Development",
        currentResearch: "Current Research:",
        startResearchButton: "Start Research",
        questsTitle: "Quests",
        currentQuest: "Current Quest:",
        acceptQuestButton: "Accept a Quest"
    }
};

let currentLanguage = 'fr';

initializeGame();

function initializeGame() {
    populateCryptoSelect();
    generateDailyQuest();
    loadGame();
    updateTextContent();
    updateCryptoCount();
    updateDailyQuest();
    updateMarketTable();
    updateBalance();
    checkAchievements();
    updateLevelUI();
    updateEnergyUI();
}

mineButton.addEventListener('click', () => {
    let amountMined = Number(cryptoPerClick) * (1 + Number(prestigeBonus));
    if (energy >= amountMined) {
        cryptoCount += amountMined;
        experience += amountMined;
        energy -= amountMined;
        checkLevelUp();
        updateCryptoCount();
        checkAchievements();
        checkDailyQuest();
        checkQuests();
        playSound('mine');
    } else {
        alert("Vous n'avez pas assez d'énergie pour miner !");
    }
});

upgradeClickButton.addEventListener('click', () => {
    let cost = 10;
    if (cryptoCount >= cost) {
        cryptoCount -= cost;
        cryptoPerClick += 1;
        updateCryptoCount();
        playSound('upgrade');
    } else {
        alert("Vous n'avez pas assez de cryptomonnaies pour cette amélioration !");
    }
});

autoMineButton.addEventListener('click', () => {
    let cost = 100;
    if (cryptoCount >= cost) {
        cryptoCount -= cost;
        cryptoPerSecond += 1;
        updateCryptoCount();
        playSound('upgrade');
    } else {
        alert("Vous n'avez pas assez de cryptomonnaies pour acheter un mineur automatique !");
    }
});

buyFarmButton.addEventListener('click', () => {
    let cost = 500;
    if (cryptoCount >= cost) {
        cryptoCount -= cost;
        cryptoPerSecond += 5;
        updateCryptoCount();
        playSound('upgrade');
    } else {
        alert("Vous n'avez pas assez de cryptomonnaies pour acheter une ferme de minage !");
    }
});

buyDataCenterButton.addEventListener('click', () => {
    let cost = 2000;
    if (cryptoCount >= cost) {
        cryptoCount -= cost;
        cryptoPerSecond += 20;
        updateCryptoCount();
        playSound('upgrade');
    } else {
        alert("Vous n'avez pas assez de cryptomonnaies pour acheter un centre de données !");
    }
});

joinPoolButton.addEventListener('click', () => {
    let cost = 5000;
    if (cryptoCount >= cost) {
        cryptoCount -= cost;
        cryptoPerSecond += 50;
        updateCryptoCount();
        playSound('upgrade');
    } else {
        alert("Vous n'avez pas assez de cryptomonnaies pour rejoindre un pool de minage !");
    }
});

buyGeneratorButton.addEventListener('click', () => {
    let cost = 200;
    if (cryptoCount >= cost) {
        cryptoCount -= cost;
        energyPerSecond += 5;
        updateCryptoCount();
        playSound('upgrade');
    } else {
        alert("Vous n'avez pas assez de cryptomonnaies pour acheter un générateur !");
    }
});

prestigeButton.addEventListener('click', () => {
    if (cryptoCount >= 10000) {
        let earnedPP = Math.floor(cryptoCount / 10000);
        prestigePoints += earnedPP;
        prestigeBonus = prestigePoints * 0.05;
        resetGameData();
        alert(`Vous avez gagné ${earnedPP} Points de Prestige !`);
        updateCryptoCount();
        playSound('prestige');
    } else {
        alert("Vous avez besoin d'au moins 10 000 cryptomonnaies pour faire un Prestige.");
    }
});

saveGameButton.addEventListener('click', () => {
    saveGame();
    alert("Jeu sauvegardé !");
    playSound('save');
});

resetGameButton.addEventListener('click', () => {
    if (confirm("Êtes-vous sûr de vouloir réinitialiser le jeu ?")) {
        localStorage.removeItem('gameData');
        location.reload();
    }
});

cryptoSelectEl.addEventListener('change', () => {
    currentCrypto = cryptocurrencies[cryptoSelectEl.value];
    cryptoValue = currentCrypto.baseValue;
    updateCryptoCount();
});

languageDropdown.addEventListener('change', () => {
    currentLanguage = languageDropdown.value;
    updateTextContent();
});

themeDropdown.addEventListener('change', () => {
    let selectedTheme = themeDropdown.value;
    document.body.className = '';
    if (selectedTheme === 'light') {
        document.body.classList.add('light-theme');
    } else {
        document.body.classList.add('dark-theme');
    }
    localStorage.setItem('selectedTheme', selectedTheme);
});

function updateMarketPrices() {
    cryptocurrencies.forEach(crypto => {
        let fluctuation = (Math.random() * 2 * crypto.volatility - crypto.volatility).toFixed(4);
        crypto.marketPrice = Math.max(1, crypto.marketPrice * (1 + parseFloat(fluctuation)));
    });
    updateMarketTable();
}

setInterval(updateMarketPrices, 10000);

function updateMarketTable() {
    marketTableEl.querySelectorAll('tr:not(:first-child)').forEach(tr => tr.remove());

    cryptocurrencies.forEach((crypto, index) => {
        let tr = document.createElement('tr');

        let nameTd = document.createElement('td');
        nameTd.textContent = crypto.name;
        tr.appendChild(nameTd);

        let priceTd = document.createElement('td');
        priceTd.textContent = '$' + Number(crypto.marketPrice).toFixed(2);
        tr.appendChild(priceTd);

        let ownedTd = document.createElement('td');
        ownedTd.textContent = portfolio[crypto.name] || 0;
        tr.appendChild(ownedTd);

        let actionTd = document.createElement('td');
        let buyButton = document.createElement('button');
        buyButton.textContent = 'Acheter';
        buyButton.addEventListener('click', () => {
            buyCrypto(index);
        });
        let sellButton = document.createElement('button');
        sellButton.textContent = 'Vendre';
        sellButton.addEventListener('click', () => {
            sellCrypto(index);
        });
        actionTd.appendChild(buyButton);
        actionTd.appendChild(sellButton);
        tr.appendChild(actionTd);

        marketTableEl.appendChild(tr);
    });
}

function buyCrypto(index) {
    let crypto = cryptocurrencies[index];
    let amount = parseFloat(prompt(`Combien de ${crypto.name} souhaitez-vous acheter ?`));
    if (isNaN(amount) || amount <= 0) {
        alert('Veuillez entrer un montant valide.');
        return;
    }
    let cost = amount * crypto.marketPrice;
    if (balance >= cost) {
        balance -= cost;
        portfolio[crypto.name] = (portfolio[crypto.name] || 0) + amount;
        updateBalance();
        updateMarketTable();
    } else {
        alert('Vous n\'avez pas assez de fonds pour cet achat.');
    }
}

function sellCrypto(index) {
    let crypto = cryptocurrencies[index];
    let amount = parseFloat(prompt(`Combien de ${crypto.name} souhaitez-vous vendre ?`));
    if (isNaN(amount) || amount <= 0) {
        alert('Veuillez entrer un montant valide.');
        return;
    }
    if ((portfolio[crypto.name] || 0) >= amount) {
        let revenue = amount * crypto.marketPrice;
        balance += revenue;
        portfolio[crypto.name] -= amount;
        updateBalance();
        updateMarketTable();
    } else {
        alert('Vous n\'avez pas assez de cryptomonnaies pour cette vente.');
    }
}

function updateBalance() {
    balanceEl.textContent = Number(balance).toFixed(2);
}

startResearchButton.addEventListener('click', () => {
    if (currentResearch) {
        alert('Une recherche est déjà en cours.');
        return;
    }
    let researchOptions = researches.filter(r => !r.unlocked).map(r => `${r.name} (Coût: ${r.cost}, Temps: ${r.time}s)`).join('\n');
    let choice = prompt('Choisissez une recherche :\n' + researchOptions);
    let selectedResearch = researches.find(r => r.name === choice);
    if (selectedResearch) {
        if (cryptoCount >= selectedResearch.cost) {
            cryptoCount -= selectedResearch.cost;
            currentResearch = selectedResearch;
            researchTimeLeft = selectedResearch.time;
            researchNameEl.textContent = currentResearch.name;
            updateCryptoCount();
        } else {
            alert('Vous n\'avez pas assez de cryptomonnaies pour cette recherche.');
        }
    } else {
        alert('Recherche invalide.');
    }
});

function updateResearch() {
    if (currentResearch) {
        researchTimeLeft--;
        if (researchTimeLeft <= 0) {
            currentResearch.effect();
            currentResearch.unlocked = true;
            alert(`Recherche terminée : ${currentResearch.name}`);
            currentResearch = null;
            researchNameEl.textContent = 'Aucune';
        }
    }
}

setInterval(updateResearch, 1000);

acceptQuestButton.addEventListener('click', () => {
    if (currentQuest) {
        alert('Vous avez déjà une quête en cours.');
        return;
    }
    let availableQuests = quests.filter(q => !q.accepted && !q.completed).map(q => q.name + ': ' + q.description).join('\n');
    let choice = prompt('Choisissez une quête :\n' + availableQuests);
    let selectedQuest = quests.find(q => q.name === choice);
    if (selectedQuest) {
        currentQuest = selectedQuest;
        currentQuest.accepted = true;
        questNameEl.textContent = currentQuest.name;
    } else {
        alert('Quête invalide.');
    }
});

function checkQuests() {
    if (currentQuest && !currentQuest.completed && currentQuest.condition()) {
        currentQuest.reward();
        currentQuest.completed = true;
        alert(`Quête terminée : ${currentQuest.name}`);
        currentQuest = null;
        questNameEl.textContent = 'Aucune';
        updateCryptoCount();
        updateBalance();
    }
}

setInterval(checkQuests, 1000);

function updateCryptoCount() {
    cryptoCountEl.textContent = Number(cryptoCount).toFixed(2);
    cryptoPerSecondEl.textContent = Number(cryptoPerSecond * (1 + prestigeBonus)).toFixed(2);
    cryptoValueEl.textContent = Number(cryptoValue).toFixed(2);
    prestigePointsEl.textContent = prestigePoints;
    levelEl.textContent = level;
    experienceEl.textContent = Number(experience).toFixed(2);
    experienceToNextLevelEl.textContent = experienceToNextLevel;
    updateEnergyUI();
    updateLevelUI();
}

function minePerSecond() {
    let amountMined = Number(cryptoPerSecond) * (1 + Number(prestigeBonus));
    if (energy >= amountMined) {
        cryptoCount += amountMined;
        experience += amountMined;
        energy -= amountMined;
        checkLevelUp();
        updateCryptoCount();
        checkAchievements();
        checkDailyQuest();
        checkQuests();
    }
}

setInterval(minePerSecond, 1000);

function regenerateEnergy() {
    energy = Math.min(maxEnergy, energy + energyPerSecond);
    updateEnergyUI();
}

setInterval(regenerateEnergy, 1000);

function updateEnergyUI() {
    energyEl.textContent = Number(energy).toFixed(2);
    maxEnergyEl.textContent = maxEnergy;
}

function checkLevelUp() {
    if (experience >= experienceToNextLevel) {
        level++;
        experience -= experienceToNextLevel;
        experienceToNextLevel = Math.floor(experienceToNextLevel * 1.5);
        alert(`Félicitations ! Vous êtes passé au niveau ${level}.`);
        cryptoPerClick += 1;
        updateLevelUI();
    }
}

function updateLevelUI() {
    levelEl.textContent = level;
    experienceEl.textContent = Number(experience).toFixed(2);
    experienceToNextLevelEl.textContent = experienceToNextLevel;
}

function fluctuateMarket() {
    let fluctuation = (Math.random() * 2 * currentCrypto.volatility - currentCrypto.volatility).toFixed(4);
    cryptoValue = Math.max(1, cryptoValue * (1 + parseFloat(fluctuation)));
    updateCryptoCount();
}

setInterval(fluctuateMarket, 10000);

function saveGame() {
    let gameData = {
        cryptoCount: Number(cryptoCount),
        cryptoPerClick: Number(cryptoPerClick),
        cryptoPerSecond: Number(cryptoPerSecond),
        cryptoValue: Number(cryptoValue),
        prestigePoints: Number(prestigePoints),
        prestigeBonus: Number(prestigeBonus),
        experience: Number(experience),
        level: Number(level),
        experienceToNextLevel: Number(experienceToNextLevel),
        energy: Number(energy),
        maxEnergy: Number(maxEnergy),
        energyPerSecond: Number(energyPerSecond),
        achievementsUnlocked: achievements.map(a => a.unlocked),
        dailyQuest: dailyQuest,
        currentCryptoIndex: cryptocurrencies.indexOf(currentCrypto),
        currentLanguage: currentLanguage,
        selectedTheme: themeDropdown.value,
        balance: Number(balance),
        portfolio: portfolio,
        cryptocurrenciesPrices: cryptocurrencies.map(crypto => Number(crypto.marketPrice)),
        researchesUnlocked: researches.map(r => r.unlocked),
        currentResearchName: currentResearch ? currentResearch.name : null,
        researchTimeLeft: researchTimeLeft,
        questsStatus: quests.map(q => ({ accepted: q.accepted, completed: q.completed })),
        currentQuestName: currentQuest ? currentQuest.name : null
    };
    localStorage.setItem('gameData', JSON.stringify(gameData));
}

function loadGame() {
    let savedGame = localStorage.getItem('gameData');
    if (savedGame) {
        let gameData = JSON.parse(savedGame);
        cryptoCount = Number(gameData.cryptoCount) || 0;
        cryptoPerClick = Number(gameData.cryptoPerClick) || 1;
        cryptoPerSecond = Number(gameData.cryptoPerSecond) || 0;
        cryptoValue = Number(gameData.cryptoValue) || 100;
        prestigePoints = Number(gameData.prestigePoints) || 0;
        prestigeBonus = Number(gameData.prestigeBonus) || 0;
        experience = Number(gameData.experience) || 0;
        level = Number(gameData.level) || 1;
        experienceToNextLevel = Number(gameData.experienceToNextLevel) || 100;
        energy = Number(gameData.energy) || 100;
        maxEnergy = Number(gameData.maxEnergy) || 100;
        energyPerSecond = Number(gameData.energyPerSecond) || 5;
        dailyQuest = gameData.dailyQuest || dailyQuest;
        currentCrypto = cryptocurrencies[gameData.currentCryptoIndex] || cryptocurrencies[0];
        currentLanguage = gameData.currentLanguage || 'fr';
        languageDropdown.value = currentLanguage;
        themeDropdown.value = gameData.selectedTheme || 'dark';
        themeDropdown.dispatchEvent(new Event('change'));
        balance = Number(gameData.balance) || 1000;
        portfolio = gameData.portfolio || {};
        cryptocurrencies.forEach((crypto, index) => {
            crypto.marketPrice = gameData.cryptocurrenciesPrices ? Number(gameData.cryptocurrenciesPrices[index]) : crypto.baseValue;
        });

        if (gameData.achievementsUnlocked) {
            achievements.forEach((achievement, index) => {
                achievement.unlocked = gameData.achievementsUnlocked[index];
                if (achievement.unlocked) {
                    let li = document.createElement('li');
                    li.textContent = achievement.name;
                    achievementsListEl.appendChild(li);
                }
            });
        }

        if (gameData.researchesUnlocked) {
            researches.forEach((research, index) => {
                research.unlocked = gameData.researchesUnlocked[index];
            });
        }
        if (gameData.currentResearchName) {
            currentResearch = researches.find(r => r.name === gameData.currentResearchName);
            researchTimeLeft = gameData.researchTimeLeft;
            researchNameEl.textContent = currentResearch.name;
        }

        if (gameData.questsStatus) {
            quests.forEach((quest, index) => {
                quest.accepted = gameData.questsStatus[index].accepted;
                quest.completed = gameData.questsStatus[index].completed;
            });
        }
        if (gameData.currentQuestName) {
            currentQuest = quests.find(q => q.name === gameData.currentQuestName);
            questNameEl.textContent = currentQuest.name;
        }

        checkDailyReward();
    }
    updateBalance();
    updateMarketTable();
}

function resetGameData() {
    cryptoCount = 0;
    cryptoPerClick = 1;
    cryptoPerSecond = 0;
    cryptoValue = currentCrypto.baseValue;
    experience = 0;
    level = 1;
    experienceToNextLevel = 100;
    energy = 100;
    maxEnergy = 100;
    energyPerSecond = 5;
    achievements.forEach(a => a.unlocked = false);
    achievementsListEl.innerHTML = '';
    balance = 1000;
    portfolio = {};
    researches.forEach(r => {
        r.unlocked = false;
    });
    currentResearch = null;
    researchTimeLeft = 0;
    researchNameEl.textContent = 'Aucune';
    quests.forEach(q => {
        q.accepted = false;
        q.completed = false;
    });
    currentQuest = null;
    questNameEl.textContent = 'Aucune';
    generateDailyQuest();
    saveGame();
    updateCryptoCount();
    updateBalance();
    updateMarketTable();
}

function checkAchievements() {
    achievements.forEach(achievement => {
        if (!achievement.unlocked && achievement.condition()) {
            achievement.unlocked = true;
            alert(`Succès débloqué : ${achievement.name}`);
            let li = document.createElement('li');
            li.textContent = achievement.name;
            achievementsListEl.appendChild(li);
            playSound('achievement');
        }
    });
}

function generateDailyQuest() {
    let quests = [
        { description: "Miner 500 cryptomonnaies", condition: () => cryptoCount >= 500, reward: 100 },
        { description: "Acheter 5 Mineurs Automatiques", condition: () => cryptoPerSecond >= 5, reward: 200 },
        { description: "Atteindre une valeur de cryptomonnaie de $200", condition: () => cryptoValue >= 200, reward: 150 }
    ];
    dailyQuest = quests[Math.floor(Math.random() * quests.length)];
    dailyQuest.completed = false;
    updateDailyQuest();
}

function updateDailyQuest() {
    dailyQuestEl.textContent = dailyQuest.description + (dailyQuest.completed ? " (Complétée)" : "");
}

function checkDailyQuest() {
    if (!dailyQuest.completed && dailyQuest.condition()) {
        dailyQuest.completed = true;
        cryptoCount += dailyQuest.reward;
        alert(`Mission accomplie ! Vous avez gagné ${dailyQuest.reward} cryptomonnaies.`);
        updateCryptoCount();
        updateDailyQuest();
        playSound('quest');
    }
}

function checkDailyReward() {
    let lastClaim = localStorage.getItem('lastDailyReward') || 0;
    let now = new Date().getTime();
    if (now - lastClaim > 86400000) {
        cryptoCount += 500;
        localStorage.setItem('lastDailyReward', now);
        alert("Vous avez reçu votre récompense quotidienne de 500 cryptomonnaies !");
        updateCryptoCount();
    }
}

function randomEvent() {
    let events = [
        {
            description: "Un article positif sur les cryptomonnaies augmente leur valeur de 10% !",
            effect: () => { cryptoValue *= 1.10; }
        },
        {
            description: "Une panne de serveur réduit votre production de moitié pendant 30 secondes.",
            effect: () => {
                cryptoPerSecond /= 2;
                setTimeout(() => {
                    cryptoPerSecond *= 2;
                }, 30000);
            }
        },
        {
            description: "Une mise à jour logicielle améliore votre efficacité de 20% pendant 60 secondes.",
            effect: () => {
                cryptoPerClick *= 1.2;
                cryptoPerSecond *= 1.2;
                setTimeout(() => {
                    cryptoPerClick /= 1.2;
                    cryptoPerSecond /= 1.2;
                }, 60000);
            }
        }
    ];
    let event = events[Math.floor(Math.random() * events.length)];
    alert(event.description);
    event.effect();
    updateCryptoCount();
    playSound('event');
}

setInterval(randomEvent, 60000);

function updateChart() {
    cryptoChart.data.labels.push('');
    cryptoChart.data.datasets[0].data.push(cryptoCount);
    if (cryptoChart.data.labels.length > 20) {
        cryptoChart.data.labels.shift();
        cryptoChart.data.datasets[0].data.shift();
    }
    cryptoChart.update();
}

setInterval(updateChart, 5000);

setInterval(saveGame, 60000);

function populateCryptoSelect() {
    cryptocurrencies.forEach((crypto, index) => {
        let option = document.createElement('option');
        option.value = index;
        option.textContent = crypto.name;
        cryptoSelectEl.appendChild(option);
    });
    cryptoSelectEl.value = cryptocurrencies.indexOf(currentCrypto);
}

function updateTextContent() {
    let t = texts[currentLanguage];

    document.getElementById('game-title').textContent = t.gameTitle;
    document.getElementById('stats-title').textContent = t.statsTitle;
    document.getElementById('crypto-count-text').childNodes[0].textContent = t.cryptoCountText + ' ';
    document.getElementById('crypto-per-second-text').childNodes[0].textContent = t.cryptoPerSecondText + ' ';
    document.getElementById('crypto-value-text').childNodes[0].textContent = t.cryptoValueText;
    document.getElementById('prestige-points-text').childNodes[0].textContent = t.prestigePointsText + ' ';
    document.getElementById('level-text').childNodes[0].textContent = t.levelText + ' ';
    document.getElementById('experience-text').childNodes[0].textContent = t.experienceText + ' ';
    document.getElementById('energy-text').childNodes[0].textContent = t.energyText + ' ';
    document.getElementById('select-crypto-title').textContent = t.selectCryptoTitle;
    document.getElementById('mine-button-text').textContent = t.mineButtonText;
    document.getElementById('upgrades-title').textContent = t.upgradesTitle;
    document.getElementById('upgrade-click-text').textContent = t.upgradeClickText;
    document.getElementById('auto-mine-text').textContent = t.autoMineText;
    document.getElementById('buy-farm-text').textContent = t.buyFarmText;
    document.getElementById('buy-datacenter-text').textContent = t.buyDataCenterText;
    document.getElementById('join-pool-text').textContent = t.joinPoolText;
    document.getElementById('buy-generator-text').textContent = t.buyGeneratorText;
    document.getElementById('daily-quest-title').textContent = t.dailyQuestTitle;
    document.getElementById('achievements-title').textContent = t.achievementsTitle;
    document.getElementById('options-title').textContent = t.optionsTitle;
    document.getElementById('prestige-button-text').textContent = t.prestigeButtonText;
    document.getElementById('save-game-text').textContent = t.saveGameText;
    document.getElementById('reset-game-text').textContent = t.resetGameText;
    document.getElementById('stats-graph-title').textContent = t.statsGraphTitle;
    document.getElementById('market-title').textContent = t.marketTitle;
    document.getElementById('player-balance').childNodes[0].textContent = t.playerBalance;
    document.getElementById('research-title').textContent = t.researchTitle;
    document.getElementById('current-research').childNodes[0].textContent = t.currentResearch + ' ';
    document.getElementById('start-research-button').textContent = t.startResearchButton;
    document.getElementById('quests-title').textContent = t.questsTitle;
    document.getElementById('current-quest').childNodes[0].textContent = t.currentQuest + ' ';
    document.getElementById('accept-quest-button').textContent = t.acceptQuestButton;

    updateDailyQuest();
}

function playSound(action) {
    let sound = new Audio();
    switch (action) {
        case 'mine':
            sound.src = 'audio/mine-sound.mp3';
            break;
        case 'upgrade':
            sound.src = 'audio/upgrade-sound.mp3';
            break;
        case 'achievement':
            sound.src = 'audio/achievement-sound.mp3';
            break;
        case 'quest':
            sound.src = 'audio/quest-sound.mp3';
            break;
        case 'event':
            sound.src = 'audio/event-sound.mp3';
            break;
        case 'prestige':
            sound.src = 'audio/prestige-sound.mp3';
            break;
        case 'save':
            sound.src = 'audio/save-sound.mp3';
            break;
    }
    sound.play();
}

mineButton.addEventListener('click', () => {
    backgroundMusic.play();
}, { once: true });
