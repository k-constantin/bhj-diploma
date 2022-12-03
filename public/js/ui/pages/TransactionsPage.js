/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
 class TransactionsPage {
	lastOptions = [];


	/**
	 * Если переданный элемент не существует,
	 * необходимо выкинуть ошибку.
	 * Сохраняет переданный элемент и регистрирует события
	 * через registerEvents()
	 * */
	constructor(element) {
		if (!element) {
			throw new Error('element is null!');
		}
		this.element = element;
		this.registerEvents();
	}



	/**
	 * Вызывает метод render для отрисовки страницы
	 * */
	update() {
		this.render(this.lastOptions);
	}



	/**
	 * Отслеживает нажатие на кнопку удаления транзакции
	 * и удаления самого счёта. Внутри обработчика пользуйтесь
	 * методами TransactionsPage.removeTransaction и
	 * TransactionsPage.removeAccount соответственно
	 * */
	registerEvents() {
		const account = this.element.querySelector(".remove-account");
		account.onclick = () => {
			this.removeAccount()
		};
	}



	/**
	 * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
	 * Если пользователь согласен удалить счёт, вызовите
	 * Account.remove, а также TransactionsPage.clear с
	 * пустыми данными для того, чтобы очистить страницу.
	 * По успешному удалению необходимо вызвать метод App.updateWidgets(),
	 * либо обновляйте только виджет со счетами
	 * для обновления приложения
	 * */
	removeAccount() {
		if (this.lastOptions) {
			console.log(this.lastOptions)
			let question = confirm("Вы действительно хотите удалить счёт?");
			if (question) {
				const data = { id: this.lastOptions.account_id };
				Account.remove(data, (error, response) => {
					if (response) {
						App.updateWidgets();
					} else alert(error);
				});
				this.clear();
			}
		}
	}

	/**
	 * Удаляет транзакцию (доход или расход). Требует
	 * подтверждеия действия (с помощью confirm()).
	 * По удалению транзакции вызовите метод App.update(),
	 * либо обновляйте текущую страницу (метод update) и виджет со счетами
	 * */
	removeTransaction(id) {
		let question = confirm("Вы действительно хотите удалить транзакцию?");
		if (!question) return;
		const data = { id };
		Transaction.remove(data, (error, response) => {
			if (response) {
				App.update();
			} else console.error(error);
		});
	}

	/**
	 * С помощью Account.get() получает название счёта и отображает
	 * его через TransactionsPage.renderTitle.
	 * Получает список Transaction.list и полученные данные передаёт
	 * в TransactionsPage.renderTransactions()
	 * */
	render(options) {
		if (!options) {
			return;
		}
		this.lastOptions = options;
		Account.get(options.account_id, (error, response) => {
			if (response && response.data) {
				this.renderTitle(response.data.name);
			}
		});
		const data = { addUrl: '?account_id=' + options.account_id };
		Transaction.list(data, (error, response) => {
			if (response) {
				this.renderTransactions(response.data);
			} else console.error(error);
		});
	}

	/**
	 * Очищает страницу. Вызывает
	 * TransactionsPage.renderTransactions() с пустым массивом.
	 * Устанавливает заголовок: «Название счёта»
	 * */
	clear() {
		this.renderTransactions([]);
		this.renderTitle('Название счёта');
	}

	/**
	 * Устанавливает заголовок в элемент .content-title
	 * */
	renderTitle(name) {
		const title = this.element.querySelector(".content-title");
		if (title) title.textContent = name;
	}

	/**
	 * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
	 * в формат «10 марта 2019 г. в 03:20»
	 * */
	formatDate(date) {
		const time = date.slice(11, 16);
		const localDate = new Date(date).toLocaleDateString('ru');
		return localDate + ' г. в ' + time;
	}

	/**
	 * Формирует HTML-код транзакции (дохода или расхода).
	 * item - объект с информацией о транзакции
	 * */
	getTransactionHTML(item) {
		const date = this.formatDate(item.created_at);
		return `<div class="transaction transaction_` + item.type + ` row">
        <div class="col-md-7 transaction__details">
      <div class="transaction__icon">
          <span class="fa fa-money fa-2x"></span>
      </div>
      <div class="transaction__info">
          <h4 class="transaction__title">` + item.name + `</h4>
          <!-- дата -->
          <div class="transaction__date">` + date + `</div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="transaction__summ">
      <!--  сумма -->
          ` + item.sum + ` <span class="currency">₽</span>
      </div>
    </div>
    <div class="col-md-2 transaction__controls">
        <!-- в data-id нужно поместить id -->
        <button class="btn btn-danger transaction__remove" data-id=` + item.id + `>
            <i class="fa fa-trash"></i>  
        </button>
    </div>
    </div>`;
	}

	/**
	 * Отрисовывает список транзакций на странице
	 * используя getTransactionHTML
	 * */
	renderTransactions(data) {
		const content = document.querySelector(".content");
		if (data && data.length === 0) {
			content.innerHTML = "";
		} else {
			content.innerHTML = "";
			data.forEach(el => {
				const code = this.getTransactionHTML(el);
				content.insertAdjacentHTML("beforeend", code);
			});
		}
		const removeTransaction = this.element.querySelectorAll('.transaction__remove');
		removeTransaction.forEach(elem => elem.onclick = () => {
			const data_id = elem.getAttribute('data-id');
			this.removeTransaction(data_id);
		});
	}
}
