"use strict";

// inicialización de variables globales
let selectedHiraganas = [];
let currentIndex = 0;
let stats = {
    correct: 0,
    incorrect: 0,
    attempts: 0
};
let history = [];

// Initiazación del juego al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    initializeGame();
    setupEventListeners();
});

/**
 * inicializa el juego seleccionando 10 Hiraganas aleatorios y reseteando el estado del juego 
 */
function inicializarJuego() {
    // Seleccionamos 10 Hiraganas aleatorios del array de datos
    selectedHiraganas = getRandomItems(datos, 10);
    
    // Reseteamos el estado del juego
    currentIndex = 0;
    stats = {
        correct: 0,
        incorrect: 0,
        attempts: 0
    };
    history = [];
    
    // Cargar la primera imagen y actualizar la UI
    loadCurrentHiragana();
    updateUI();
    document.getElementById('answer-input').focus();
}

/**
 * Selecciona un número específico de elementos aleatorios de un array
 * @param {Array} array - Array del cual seleccionar los elementos
 * @param {number} count - Número de elementos a seleccionar
 * @returns {Array} Array con los elementos seleccionados aleatoriamente
 */
function getRandomItems(array, count) {
    const shuffled = [...array].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

/**
 * Carga la imagen del Hiragana actual y actualiza el contador de imágenes
 */
function loadCurrentHiragana() {
    if (currentIndex < selectedHiraganas.length) {
        const currentHiragana = selectedHiraganas[currentIndex];
        document.getElementById('hiragana-image').src = currentHiragana.url;
        document.getElementById('hiragana-image').alt = currentHiragana.name;
        document.getElementById('image-number').textContent = currentIndex + 1;
        document.getElementById('answer-input').value = '';
        document.getElementById('answer-input').focus();
    }
}

/** Configura los event listeners para el formulario de respuesta y el botón de reiniciar
 */
function setupEventListeners() {
    document.getElementById('answer-form').addEventListener('submit', handleAnswerSubmit);
    document.getElementById('restart-button').addEventListener('click', inicializarJuego);
}

/**
 * Maneja el envío del formulario de respuesta, verificando la respuesta y actualizando el estado del juego
 * @param {Event} event - Evento de envío del formulario
 */
function handleAnswerSubmit(event) {
    event.preventDefault();
    
    const userAnswer = document.getElementById('answer-input').value.trim().toLowerCase();
    const currentHiragana = selectedHiraganas[currentIndex];
    
    let result;
    if (userAnswer === currentHiragana.name.toLowerCase()) {
        stats.correct++;
        result = 'Correcto';
    } else {
        stats.incorrect++;
        result = 'Incorrecto';
    }
    stats.attempts++;
    
    // Agregar resultado al historial
    history.push({
        hiragana: currentHiragana.name,
        userAnswer: userAnswer,
        result: result
    });
    
    // Actualizar la UI y cargar el siguiente Hiragana
    updateUI();
    currentIndex++;
    if (currentIndex < selectedHiraganas.length) {
        loadCurrentHiragana();
    } else {
        alert('¡Juego terminado! Revisa tu resumen y el historial de respuestas.');
    }
}

/**
 * Actualiza la interfaz de usuario con las estadísticas actuales y el historial de respuestas
 */
function updateUI() {
    document.getElementById('correct-count').textContent = stats.correct;
    document.getElementById('incorrect-count').textContent = stats.incorrect;
    
    const historyBody = document.getElementById('contenedor-historial');
    historyBody.innerHTML = '';
    
    if (history.length === 0) {
        historyBody.innerHTML = '<tr><td colspan="3" class="empty-message">Todavía no hay respuestas registradas.</td></tr>';
    } else {
        history.forEach((entry, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${entry.hiragana}</td>
                <td>${entry.userAnswer} - ${entry.result}</td>
            `;
            historyBody.appendChild(row);
        });
    }
}         
