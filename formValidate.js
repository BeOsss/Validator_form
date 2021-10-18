//đối tượng validator
function Validator(options) {
	let formElement = document.querySelector(options.form);

	let selectorRules = {};

	//Hàm thực hiện validate
	function isValid(inputElement) {
		let errorElement =
			inputElement.parentElement.querySelector(".form-message");
		errorElement.innerText = "";
		inputElement.parentElement.classList.remove("invalid");
	}
	function validate(inputElement, rule) {
		let errorElement =
			inputElement.parentElement.querySelector(".form-message");
		let errorMessage;

		//Lấy các rules của selector
		let rules = selectorRules[rule.seletor];
		/*Lặp qua từng rules và kiểm tra
		  Nếu có lỗi thì rời khỏi vòng lặp
		*/
		for (let i = 0; i < rules.length; i++) {
			errorMessage = rules[i](inputElement.value);
			if (errorMessage) break;
		}

		if (errorMessage) {
			errorElement.innerText = errorMessage;
			inputElement.parentElement.classList.add("invalid");
		} else {
			isValid(inputElement, rule);
		}
	}

	if (formElement) {
		//Submit form
		formElement.onsubmit = (e) => {
			e.preventDefault();
			
			options.rules.forEach((rule) => {
				let inputElement = formElement.querySelector(rule.seletor);
				validate(inputElement, rule);
			});
		};

		//Lặp qua mỗi rules và xử lý lắng nghe(...)
		options.rules.forEach((rule) => {
			//Lưu lại các rules cho mỗi input
			if (Array.isArray(selectorRules[rule.seletor])) {
				selectorRules[rule.seletor].push(rule.test);
			} else {
				selectorRules[rule.seletor] = [rule.test];
			}

			let inputElement = formElement.querySelector(rule.seletor);
			if (inputElement) {
				inputElement.onblur = () => {
					validate(inputElement, rule);
				};
				inputElement.oninput = () => {
					isValid(inputElement, rule);
				};
			}
		});
	}
}

//Định nghĩa các rules
//Nguyên tắc chung của các rule:
//  Khi có lỗi trả tra message lỗi
//  Khi k có lỗi trả về undefined
Validator.isRequired = (seletor, message = "Vui lòng nhập trường này") => {
	return {
		seletor,
		test: (value) => {
			return value.trim() ? undefined : message;
		},
	};
};

Validator.isEmail = (seletor, message = "Trường này phải là Email") => {
	return {
		seletor,
		test: (value) => {
			var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
			return regex.test(value) ? undefined : message;
		},
	};
};

Validator.passwordRequired = (
	seletor,
	message = "Mật khẩu bắt buộc phải có 1 ký tự số, 1 ký tự in hoa, không chứa kí tự đặc biệt và chứa ít nhất 8 kí tự"
) => {
	return {
		seletor,
		test: (value) => {
			let a = 10;
			let regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
			return regex.test(value) ? undefined : message;
		},
	};
};

Validator.minLength = (
	seletor,
	min,
	message = `Mật khẩu phải trên ${min} kí tự`
) => {
	return {
		seletor,
		test: (value) => {
			return value.length >= min ? undefined : message;
		},
	};
};

Validator.isConfirmed = (
	seletor,
	getComfirmValue,
	message = "Giá trị nhập vào không đúng"
) => {
	return {
		seletor,
		test: (value) => {
			return value === getComfirmValue() ? undefined : message;
		},
	};
};

const array1 = [
	{ name: "Giày", amount: 100 },
	{ name: "Áo phao", amount: 110 },
	{ name: "Smart phone", amount: 400 },
];
