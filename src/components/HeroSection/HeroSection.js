import React from 'react';
import './HeroSection.css';

class HeroSection extends React.Component {
	constructor(props) {
		super(props);
		this.handleScroll = this.handleScroll.bind(this);
	}
	
	componentDidMount() {
		setTimeout(() => {
			const heroContainerRef = document.querySelector('.hero-container');
			if (heroContainerRef !== null && heroContainerRef.getBoundingClientRect().y > window.innerHeight / 4 && heroContainerRef.getBoundingClientRect().bottom > 0) {
					const scrollDown = `
			<div id="scrollDownMsgContainer">
			<div id="scrollDownMsg">⬇ Scroll Down ⬇</div>
			</div>`;
					heroContainerRef.innerHTML += scrollDown;
					window.addEventListener('scroll', this.handleScroll)
			}
		}, 2000)
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll);
	}

	handleScroll() {
			if (document.getElementById('scrollDownMsgContainer')) {
			const heroContainerRef = document.querySelector('.hero-container');
			const scrollDownMsgContainer = document.getElementById('scrollDownMsgContainer')
			scrollDownMsgContainer.parentNode.removeChild(scrollDownMsgContainer);
			window.removeEventListener('scroll', this.handleScroll)
				setTimeout(() => {
					if (heroContainerRef.getBoundingClientRect().bottom > 0) {
						const scrollDown = `
			<div id="scrollDownMsgContainer">
			<div id="scrollDownMsg">⬇ Scroll Down ⬇</div>
			</div>`;
						heroContainerRef.innerHTML += scrollDown;
						window.addEventListener('scroll', this.handleScroll)
					}
			}, 150)
		}
	}
	
	render() {
		return (
			<div id="hero-container">
				<div className="explanation">
					<h1 className="hero-exp">Jeahz</h1>
					<p className="hero-exp">A student</p>
				</div>
			</div>
		)
	}
}




export default HeroSection;