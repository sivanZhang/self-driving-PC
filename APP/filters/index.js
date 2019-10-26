import dayjs from "dayjs";
//时间戳格式化为 YYYY/MM/DD
export function dateFormat(date) {
    if (date) {
        date *= 1000
        return dayjs(date).format("YYYY/MM/DD")
    } else {
        return ''
    }
}
//时间戳格式化为 YYYY/MM/DD HH:mm:ss
export function dateTimeFormat(date) {
    if (date) {
        date *= 1000
        return dayjs(date).format("YYYY/MM/DD HH:mm")
    } else {
        return ''
    }
}

// export function dateTimeFormat(date) {
// 	if (date) {
// 		const TIME = new Date(date * 1000)

// 		function add0(val) {
// 			if (val < 10) {
// 				return `0${val}`
// 			} else {
// 				return val
// 			}
// 		}
// 		let [dd, mm, MM, hh] = [add0(TIME.getDate()),
// 			add0(TIME.getMonth() + 1),
// 			add0(TIME.getMinutes()),
// 			add0(TIME.getHours())
// 		]

// 		return `${mm}/${dd}/${TIME.getFullYear()} ${hh}:${MM}`
// 	} else {
// 		return ''
// 	}
// }
// export function dateFormat(date) {
// 	if (date) {
// 		const TIME = new Date(date * 1000)

// 		function add0(val) {
// 			if (val < 10) {
// 				return `0${val}`
// 			} else {
// 				return val
// 			}
// 		}
// 		let [dd, mm] = [add0(TIME.getDate()),
// 			add0(TIME.getMonth() + 1)
// 		]

// 		return `${mm}/${dd}/${TIME.getFullYear()}`
// 	} else {
// 		return ''
// 	}
// }
