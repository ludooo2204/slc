export function comparer(a, b) {
	const dateA = new Date(a.dateEtalonnage);
	const dateB = new Date(b.dateEtalonnage);

	let comparaison = 0;
	if (dateA > dateB) {
		comparaison = 1;
	} else if (dateA < dateB) {
		comparaison = -1;
	}
	return comparaison;
}

export function interpoler(x, points, wrapAround) {
	// Make sure all points are in order
	points = points.sort((a, b) => {
		if (a[0] > b[0]) return 1;
		if (a[0] < b[0]) return -1;
		return 0;
	});

	// Find the right interval
	let i1, i2;
	for (i2 = 0; i2 < points.length; i2++) if (points[i2][0] >= x) break;
	if (i2 === points.length) {
		// We hit the upper bound
		if (wrapAround) {
			i2 = 0;
			i1 = points.length - 1;
		} else {
			i2 = i2 - 1;
			i1 = i2;
		}
	} else if (i2 === 0) {
		// We hit the lower bound
		if (wrapAround) {
			i2 = 0;
			i1 = points.length - 1;
		} else {
			i1 = i2;
		}
	} else {
		i1 = i2 - 1;
	}

	// Same points -> Return y
	if (i1 === i2) return points[i1][1];

	// Interpolate value
	let [x1, y1] = points[i1];
	let [x2, y2] = points[i2];
	// We wrapped around the clock
	if (i1 >= i2) {
		if (x >= x1) x2 += wrapAround;
		else x1 -= wrapAround;
	}
	const m = (y2 - y1) / (x2 - x1);
	const b = (x2 * y1 - x1 * y2) / (x2 - x1);

	return m * x + b;
}
