import {
	animate,
	animateChild,
	keyframes,
	query,
	state,
	style,
	transition,
	trigger,
} from '@angular/animations';

export enum FullScreenState {
	visible = 'visible',
	hidden = 'hidden',
}

export const fullScreenAnimations = [
	trigger('wrapperReveal', [
		state(
			FullScreenState.visible,
			style({
				inset: 0,
				'z-index': 20,
				visibility: 'visible',
				opacity: 1,
				'pointer-events': 'auto',
				'touch-action': 'auto',
				background: 'rgba(0, 0, 0, 0.8)',
			}),
		),
		state(
			FullScreenState.hidden,
			style({
				top: -999,
				left: -999,
				'z-index': -10,
				visibility: 'hidden',
				opacity: 0,
				'pointer-events': 'none',
				'touch-action': 'none',
				background: 'none',
			}),
		),
		transition(`${FullScreenState.hidden} => ${FullScreenState.visible}`, [
			animate(
				'300ms',
				keyframes([
					style({
						inset: 0,
						'z-index': 20,
						'pointer-events': 'auto',
						'touch-action': 'auto',
						offset: 0,
					}),
					style({
						visibility: 'visible',
						opacity: 1,
						background: 'rgba(0, 0, 0, 0.8)',
						offset: 1,
					}),
				]),
			),
			query('@containerReveal', animateChild()),
		]),
		transition(`${FullScreenState.visible} => ${FullScreenState.hidden}`, [
			animate(
				'300ms',
				keyframes([
					style({
						visibility: 'hidden',
						opacity: 0,
						'pointer-events': 'none',
						'touch-action': 'none',
						background: 'none',
						offset: 1,
					}),
				]),
			),
		]),
	]),
	trigger('containerReveal', [
		state(
			FullScreenState.visible,
			style({
				transform: 'translate3d(0, 0, 0)',
			}),
		),
		state(
			FullScreenState.hidden,
			style({
				transform: 'translate3d(0, 100%, 0)',
			}),
		),
		transition(
			`${FullScreenState.hidden} => ${FullScreenState.visible}`,
			animate(
				'200ms',
				keyframes([
					style({ transform: 'translate3d(0, 100%, 0)', offset: 0 }),
					style({ transform: 'translate3d(0, 0, 0)', offset: 1 }),
				]),
			),
		),
	]),
];
