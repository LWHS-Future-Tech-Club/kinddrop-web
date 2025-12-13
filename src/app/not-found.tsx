import TopBar from './components/TopBar';

const messages = [
	"Seems like you're lost. Let's take you back home.",
	"This page couldn't be found. We'll help you get back on track.",
	"We couldn't locate that page. Returning you to safer ground.",
	"Sorry, we can't find what you're looking for. Let's head home.",
	"This page isn't available. Let's guide you back.",
	"Looks like you've reached a dead end. Let's return to the homepage.",
	"Page not found. We'll help you find your way.",
];

function getRandomMessage() {
	return messages[Math.floor(Math.random() * messages.length)];
}

export default function NotFound() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-[#04011E] to-[#1a0033] flex flex-col">
			<TopBar />
			<div className="flex-1 flex items-center justify-center px-6">
				<div className="glass-card p-10 max-w-xl w-full text-center rounded-2xl">
					<h1 className="text-7xl font-bold text-glow mb-3">404</h1>
					<p className="text-white/70 mb-2">{getRandomMessage()}</p>
					<div className="mt-6 flex items-center justify-center gap-3">
						<a href="/" className="btn-glow px-6 py-2">
							Go Home
						</a>
					</div>
				</div>
			</div>
			<div className="floating-glow" style={{ top: '20%', left: '10%' }} />
			<div className="floating-glow" style={{ top: '60%', left: '70%' }} />
		</div>
	);
}
