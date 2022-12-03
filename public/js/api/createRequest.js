/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
 const createRequest = (options = {}) => {
	if (options.data && options.data.addUrl) options.url += options.data.addUrl;
	const xhr = new XMLHttpRequest();
	xhr.responseType = 'json';
	try {
		xhr.open(options.method, options.url);
		if (options.data && options.data.id) {
			const form = new FormData();
			form.append('id', options.data.id);
			xhr.send(form);
		}
		else xhr.send(options.data);
	} catch (e) {
		options.callback(new Error(e.message), null);
	};

	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4) {
			if (xhr.response && xhr.response['success']) {
				options.callback(null, xhr.response);
			} else if (xhr.response) options.callback(xhr.response['error'], null);
		};
	};
};
