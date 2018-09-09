import '../css/index.scss';

import _ from 'lodash';

function component() {
	const element = document.createElement('h1');

	element.innerHTML = _.join(['Sass', 'Boilerplate'], ' ');
	element.classList.add('javascript');

	return element;
}

document.body.appendChild(component());
