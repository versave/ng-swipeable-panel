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
				zIndex: 20,
				visibility: 'visible',
				pointerEvents: 'auto',
				touchAction: 'auto',
				background: 'rgba(0, 0, 0, 0.8)',
			}),
		),
		state(
			FullScreenState.hidden,
			style({
				zIndex: -10,
				visibility: 'hidden',
				pointerEvents: 'none',
				touchAction: 'none',
				background: 'none',
			}),
		),
		transition(`${FullScreenState.hidden} => ${FullScreenState.visible}`, [
			animate(
				'150ms',
				keyframes([
					style({
						zIndex: 20,
						pointerEvents: 'auto',
						touchAction: 'auto',
						offset: 0,
					}),
					style({
						visibility: 'visible',
						background: 'rgba(0, 0, 0, 0.8)',
						offset: 1,
					}),
				]),
			),
			query('@containerReveal', animateChild()),
		]),
		transition(`${FullScreenState.visible} => ${FullScreenState.hidden}`, [
			animate(
				'150ms',
				keyframes([
					style({
						visibility: 'hidden',
						pointerEvents: 'none',
						touchAction: 'none',
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
				'100ms',
				keyframes([
					style({ transform: 'translate3d(0, 100%, 0)', offset: 0 }),
					style({ transform: 'translate3d(0, 0, 0)', offset: 1 }),
				]),
			),
		),
	]),
];
