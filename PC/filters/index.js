export function dateTimeFormat(date) {
	if (date) {
		const TIME = new Date(date * 1000)

		function add0(val) {
			if (val < 10) {
				return `0${val}`
			} else {
				return val
			}
		}
		let [dd, mm, MM, hh] = [add0(TIME.getDate()),
			add0(TIME.getMonth() + 1),
			add0(TIME.getMinutes()),
			add0(TIME.getHours())
		]

		return `${mm}/${dd}/${TIME.getFullYear()} ${hh}:${MM}`
	} else {
		return ''
	}
}
export function dateFormat(date) {
	if (date) {
		const TIME = new Date(date * 1000)

		function add0(val) {
			if (val < 10) {
				return `0${val}`
			} else {
				return val
			}
		}
		let [dd, mm] = [add0(TIME.getDate()),
			add0(TIME.getMonth() + 1)
		]

		return `${mm}/${dd}/${TIME.getFullYear()}`
	} else {
		return ''
	}
}
