// Store game state in variables
let name = "Guest";
let score = 0;
let digits = [];
let translations = {
    en: {
        welcome: "Welcome to Number Puzzle!",
        enter_name: "Enter your name",
        player: "Player",
        score: "Score",
        start_game: "Start Game",
        change_language: "Change Language",
        create_expression: "Create an expression that equals 10 using these digits:",
        digits: "Digits",
        submit: "Submit",
        next_puzzle: "Next Puzzle",
        name_placeholder: "Enter your name",
        expression_placeholder: "Enter your expression",
        congratulations: "Congratulations, you solved the puzzle!",
        incorrect_result: "The result is not correct. It was {{ result }}.",
        invalid_expression: "The expression '{{ expression }}' is invalid.",
        invalid_digits: "The expression uses invalid digits.",
        greeting: "Welcome, {{ name }}!",
        pass: "Pass",
        pass_message: "The correct expression was: {{ correctExpression }}",
        try_another_set: "Try Another Set",
        expression_error: "Your expression '{{ expression }}' is invalid. It evaluates to {{ result }}."
    },
    cz: {
        welcome: "Vítejte v číselné hádance!",
        enter_name: "Zadejte své jméno",
        player: "Hráč",
        score: "Skóre",
        start_game: "Začít hru",
        change_language: "Změnit jazyk",
        create_expression: "Vytvořte výraz, který se rovná 10 pomocí těchto číslic:",
        digits: "Číslice",
        submit: "Odeslat",
        next_puzzle: "Další hádanka",
        name_placeholder: "Zadejte své jméno",
        expression_placeholder: "Zadejte svůj výraz",
        congratulations: "Gratulujeme, vyřešili jste hádanku!",
        incorrect_result: "Výsledek není správný. Byl {{ result }}.",
        invalid_expression: "Výraz '{{ expression }}' není platný.",
        invalid_digits: "Výraz používá neplatné číslice.",
        greeting: "Vítejte, {{ name }}!",
        pass: "Přeskočit",
        pass_message: "Správný výraz byl: {{ correctExpression }}",
        try_another_set: "Zkusit jinou sadu",
        expression_error: "Váš výraz '{{ expression }}' je neplatný. Výsledek je {{ result }}."
    },
    uk: {
        welcome: "Ласкаво просимо до числової головоломки!",
        enter_name: "Введіть своє ім'я",
        player: "Гравець",
        score: "Рахунок",
        start_game: "Почати гру",
        change_language: "Змінити мову",
        create_expression: "Створіть вираз, що дорівнює 10, використовуючи ці цифри:",
        digits: "Цифри",
        submit: "Підтвердити",
        next_puzzle: "Наступна головоломка",
        name_placeholder: "Введіть своє ім'я",
        expression_placeholder: "Введіть свій вираз",
        congratulations: "Вітаємо, ви розв'язали головоломку!",
        incorrect_result: "Результат неправильний. Було {{ result }}.",
        invalid_expression: "Вираз '{{ expression }}' недійсний.",
        invalid_digits: "Вираз використовує недійсні цифри.",
        greeting: "Ласкаво просимо, {{ name }}!",
        pass: "Пропустити",
        pass_message: "Правильний вираз був: {{ correctExpression }}",
        try_another_set: "Спробувати інший набір",
        expression_error: "Ваш вираз '{{ expression }}' недійсний. Результат: {{ result }}."
    }
};
let currentLanguage = "en";

// Wait for DOM to be fully loaded before accessing elements
document.addEventListener('DOMContentLoaded', function () {
    // DOM elements
    const userNameSpan = document.getElementById('user-name');
    const scoreSpan = document.getElementById('score');
    const digitsSpan = document.getElementById('digits');
    const messageP = document.getElementById('message');
    const expressionInput = document.getElementById('expression');
    const submitButton = document.getElementById('submit-button');
    const nextButton = document.getElementById('next-button');
    const passButton = document.getElementById('pass-button');
    const nameInput = document.getElementById('name-input');
    const startGameButton = document.getElementById('start-game');
    const greetingP = document.getElementById('greeting');
    const languageSelect = document.getElementById('language-select');
    const startPage = document.getElementById('start-page');
    const gamePage = document.getElementById('game-page');

    // Function to update all translations on the page
    function updatePageLanguage() {
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[currentLanguage][key]) {
                if (element.tagName === 'INPUT') {
                    element.placeholder = translations[currentLanguage][key];
                } else {
                    element.textContent = translations[currentLanguage][key];
                }
            }
        });

        if (name && greetingP) {
            greetingP.textContent = translations[currentLanguage].greeting.replace("{{ name }}", name);
        }
    }

    // Generate random digits for the puzzle
    function generateDigits() {
        digits = Array.from({ length: 4 }, () => Math.floor(Math.random() * 9) + 1);
        digitsSpan.textContent = `[${digits.join(", ")}]`;
    }

    // Validate the expression
    function validateExpression(expression) {
        const usedDigits = [...new Set(expression.replace(/[^\d]/g, '').split('').map(Number))];
        return usedDigits.length === digits.length && usedDigits.every(digit => digits.includes(digit));
    }

    // Check if the result is correct
    function checkExpression(expression) {
        try {
            const result = eval(expression);
            return result === 10;
        } catch (e) {
            return false;
        }
    }

    // Show the message based on the result
    function showMessage(isCorrect, expression) {
        if (isCorrect) {
            messageP.textContent = translations[currentLanguage].congratulations;
            score++;
            scoreSpan.textContent = score;
            nextButton.style.display = "inline-block";
            submitButton.style.display = "none";
            passButton.style.display = "none";
        } else {
            const result = eval(expression);
            messageP.innerHTML = translations[currentLanguage].expression_error
                .replace("{{ expression }}", `<span class="highlight-error">${expression}</span>`)
                .replace("{{ result }}", result);
        }
    }

    // Function to find a correct expression
    function findCorrectExpression() {
        const operators = ['+', '-', '*', '/'];
        const permutations = getPermutations(digits);

        for (let perm of permutations) {
            for (let op1 of operators) {
                for (let op2 of operators) {
                    for (let op3 of operators) {
                        const expression = `${perm[0]}${op1}${perm[1]}${op2}${perm[2]}${op3}${perm[3]}`;
                        if (checkExpression(expression)) {
                            return expression;
                        }
                    }
                }
            }
        }
        return null;
    }

    // Function to generate all permutations of the digits
    function getPermutations(arr) {
        if (arr.length <= 1) return [arr];
        const result = [];
        for (let i = 0; i < arr.length; i++) {
            const current = arr[i];
            const remaining = arr.slice(0, i).concat(arr.slice(i + 1));
            const remainingPerms = getPermutations(remaining);
            for (let perm of remainingPerms) {
                result.push([current].concat(perm));
            }
        }
        return result;
    }

    // Event Listeners
    submitButton.addEventListener('click', () => {
        const expression = expressionInput.value.trim();
        if (!expression) {
            messageP.textContent = translations[currentLanguage].invalid_expression.replace("{{ expression }}", expression);
        } else if (validateExpression(expression)) {
            const isCorrect = checkExpression(expression);
            showMessage(isCorrect, expression);
        } else {
            messageP.textContent = translations[currentLanguage].invalid_digits;
        }
    });

    passButton.addEventListener('click', () => {
        const correctExpression = findCorrectExpression();
        if (correctExpression) {
            messageP.textContent = translations[currentLanguage].pass_message.replace("{{ correctExpression }}", correctExpression);
            nextButton.style.display = "inline-block";
            submitButton.style.display = "none";
            passButton.style.display = "none";
        } else {
            messageP.textContent = translations[currentLanguage].invalid_expression;
        }
    });

    nextButton.addEventListener('click', () => {
        generateDigits();
        expressionInput.value = '';
        messageP.textContent = '';
        nextButton.style.display = "none";
        submitButton.style.display = "inline-block";
        passButton.style.display = "inline-block";
    });

    // Start game
    startGameButton.addEventListener('click', () => {
        name = nameInput.value.trim() || "Guest";
        userNameSpan.textContent = name;
        greetingP.textContent = translations[currentLanguage].greeting.replace("{{ name }}", name);
        startPage.style.display = "none";
        gamePage.style.display = "block";
        generateDigits();
    });

    // Change language
    languageSelect.addEventListener('change', () => {
        currentLanguage = languageSelect.value;
        updatePageLanguage();
    });

    // Initialize game
    function initGame() {
        startPage.style.display = "block";
        gamePage.style.display = "none";
        updatePageLanguage();
    }

    initGame();
});
