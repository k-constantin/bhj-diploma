/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

 class AccountsWidget {
	/**
	 * Устанавливает текущий элемент в свойство element
	 * Регистрирует обработчики событий с помощью
	 * AccountsWidget.registerEvents()
	 * Вызывает AccountsWidget.update() для получения
	 * списка счетов и последующего отображения
	 * Если переданный элемент не существует,
	 * необходимо выкинуть ошибку.
	 * */
	constructor(element) {
		if (!element) {
			throw new Error('element is null!');
		}
		this.element = element;
		this.registerEvents();
		this.update();
	}



	/**
	 * При нажатии на .create-account открывает окно
	 * #modal-new-account для создания нового счёта
	 * При нажатии на один из существующих счетов
	 * (которые отображены в боковой колонке),
	 * вызывает AccountsWidget.onSelectAccount()
	 * */
	registerEvents() {
		const createAccount = this.element.querySelector('.create-account');
		createAccount.onclick = () => {
			App.getModal('createAccount').open();
		}
		const accounts = document.querySelectorAll('.account');

		accounts.forEach(elem => {
			elem.addEventListener('click', event => {
				this.onSelectAccount(elem);
			});
		});
	}



	/**
	 * Метод доступен только авторизованным пользователям
	 * (User.current()).
	 * Если пользователь авторизован, необходимо
	 * получить список счетов через Account.list(). При
	 * успешном ответе необходимо очистить список ранее
	 * отображённых счетов через AccountsWidget.clear().
	 * Отображает список полученных счетов с помощью
	 * метода renderItem()
	 * */
	update() {
		let currentUser = User.current();
		if (currentUser) {
			Account.list(currentUser, (err, response) => {
				if (response) {
					this.clear();
					response.data.forEach(item => this.renderItem(item));
				}
			});
		}
	}



	/**
	 * Очищает список ранее отображённых счетов.
	 * Для этого необходимо удалять все элементы .account
	 * в боковой колонке
	 * */
	clear() {
		let collection = document.querySelectorAll(".account");
		collection.forEach(e => e.remove());
	}



	/**
	 * Срабатывает в момент выбора счёта
	 * Устанавливает текущему выбранному элементу счёта
	 * класс .active. Удаляет ранее выбранному элементу
	 * счёта класс .active.
	 * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
	 * */
	onSelectAccount(element) {
		element.classList.add("active");
		const activeElements = this.element.querySelectorAll('.active');
		activeElements.forEach(item => {
			if (item !== element) {
				item.classList.remove('active');
			}
		})
		const account_id = element.getAttribute('data-id');
		App.showPage('transactions', { 'account_id': account_id });
	}

	/**
	 * Возвращает HTML-код счёта для последующего
	 * отображения в боковой колонке.
	 * item - объект с данными о счёте
	 * */
	getAccountHTML(item) {
		return `<li class="account" data-id="${item.id}"> 
		<a href="#"> 
			 <span>` + item.name + `</span> 
			 <span>` + item.sum + ` ₽</span>
		</a>
		</li>`;
	}

	/**
	 * Получает массив с информацией о счетах.
	 * Отображает полученный с помощью метода
	 * AccountsWidget.getAccountHTML HTML-код элемента
	 * и добавляет его внутрь элемента виджета
	 * */
	renderItem(data) {
		const panel = document.querySelector('.accounts-panel');
		panel.insertAdjacentHTML('beforeend', this.getAccountHTML(data));
		this.registerEvents();
	}
}
