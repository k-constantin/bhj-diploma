/**
 * Класс TransactionsWidget отвечает за
 * открытие всплывающих окон для
 * создания нового дохода или расхода
 * */

 class TransactionsWidget {
	/**
	 * Устанавливает полученный элемент
	 * в свойство element.
	 * Если переданный элемент не существует,
	 * необходимо выкинуть ошибку.
	 * */
	constructor(element) {
		if (!element) {
			throw new Error('element is null!');
		}
		this.element = element;
		this.registerEvents();
	}

	/**
	 * Регистрирует обработчики нажатия на
	 * кнопки «Новый доход» и «Новый расход».
	 * При нажатии вызывает Modal.open() для
	 * экземпляра окна
	 * */
	registerEvents() {
		this.element.onclick = (event) => {
			event.preventDefault();
			if (event.target === this.element.querySelector(".create-income-button")) {
				App.getModal('newIncome').open();
			}
			else if (event.target === this.element.querySelector(".create-expense-button")) {
				App.getModal('newExpense').open();
			}
		}
	}
}