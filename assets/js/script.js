(() => {
	const menuButton = document.querySelector('button[aria-controls="mobile-navigation"]');
	const desktopNav = document.querySelector("header nav");
	if (!menuButton || !desktopNav) return;

	const drawer = document.createElement("div");
	drawer.className = "mobile-nav";
	drawer.id = "mobile-navigation";
	drawer.setAttribute("aria-hidden", "true");
	drawer.innerHTML = `
		<div class="mobile-nav__backdrop" data-mobile-nav-close></div>
		<aside class="mobile-nav__panel" role="dialog" aria-modal="true" aria-label="Mobile navigation">
			<div class="mobile-nav__head">
				<span class="mobile-nav__brand">
					<img src="assets/images/axa-business-technologies-logo.svg" alt="AXA Business Technologies">
					<span class="brand-sled-label"><span class="brand-sled-label__pipe" aria-hidden="true"></span><span>US SLED</span></span>
				</span>
				<button class="mobile-nav__close" type="button" aria-label="Close menu" data-mobile-nav-close>&times;</button>
			</div>
			<nav class="mobile-nav__links"></nav>
			<a class="mobile-nav__cta" href="https://www.axabiztech.com" target="_blank" rel="noreferrer">Back to Main Site</a>
		</aside>
	`;

	const linksWrap = drawer.querySelector(".mobile-nav__links");
	desktopNav.querySelectorAll("a").forEach((link) => {
		const item = document.createElement("a");
		item.href = link.href;
		item.textContent = link.textContent.trim();
		linksWrap.appendChild(item);
	});

	document.body.appendChild(drawer);
	const closeButton = drawer.querySelector(".mobile-nav__close");

	const openNav = () => {
		drawer.classList.add("is-open");
		drawer.setAttribute("aria-hidden", "false");
		menuButton.setAttribute("aria-expanded", "true");
		menuButton.setAttribute("aria-label", "Close menu");
		document.body.classList.add("mobile-nav-open");
		closeButton?.focus({ preventScroll: true });
	};

	const closeNav = (returnFocus = false) => {
		if (!drawer.classList.contains("is-open")) return;
		drawer.classList.remove("is-open");
		drawer.setAttribute("aria-hidden", "true");
		menuButton.setAttribute("aria-expanded", "false");
		menuButton.setAttribute("aria-label", "Open menu");
		document.body.classList.remove("mobile-nav-open");
		if (returnFocus) menuButton.focus({ preventScroll: true });
	};

	menuButton.addEventListener("click", () => {
		if (drawer.classList.contains("is-open")) {
			closeNav(true);
			return;
		}
		openNav();
	});

	drawer.addEventListener("click", (event) => {
		if (event.target.closest("[data-mobile-nav-close]") || event.target.closest(".mobile-nav__links a")) {
			closeNav(true);
		}
	});

	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape") closeNav(true);
	});

	window.addEventListener("resize", () => {
		if (window.innerWidth >= 1024) closeNav();
	});
})();
(() => {
	const navLinks = Array.from(document.querySelectorAll('header nav a[href^="#"], .mobile-nav__links a[href^="#"]'));
	if (!navLinks.length) return;

	const sectionIds = [...new Set(navLinks.map((link) => link.getAttribute("href")?.slice(1)).filter(Boolean))];
	const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
	if (!sections.length) return;

	const setActiveLink = (activeId) => {
		navLinks.forEach((link) => {
			const isActive = link.getAttribute("href") === `#${activeId}`;
			link.classList.toggle("nav-link-active", isActive);
			if (isActive) {
				link.setAttribute("aria-current", "true");
			} else {
				link.removeAttribute("aria-current");
			}
		});
	};

	const updateActiveLink = () => {
		const scrollPosition = window.scrollY + 112;
		const pageBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
		let activeId = sections[0].id;

		if (pageBottom) {
			activeId = sections[sections.length - 1].id;
		} else {
			sections.forEach((section) => {
				if (section.offsetTop <= scrollPosition) activeId = section.id;
			});
		}

		setActiveLink(activeId);
	};

	updateActiveLink();
	window.addEventListener("scroll", updateActiveLink, { passive: true });
	window.addEventListener("resize", updateActiveLink);
	window.addEventListener("hashchange", updateActiveLink);
})();
(() => {
	document.querySelectorAll("form label").forEach((label, index) => {
		const field = label.parentElement?.querySelector("input, textarea, select");
		if (!field) return;

		const id = field.id || `contact-field-${index + 1}`;
		field.id = id;
		label.setAttribute("for", id);
	});
})();
(() => {
	const impact = document.getElementById("impact");
	if (!impact) return;

	const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	const counters = [
		{ label: "Engineers on Bench", value: 340, suffix: "+" },
		{ label: "U.S. Time-Zone Cover", value: 24, suffix: "/7" },
		{ label: "SLED Practice Areas", value: 15, suffix: "+" },
		{ label: "Compliance Hit Rate", value: 98, suffix: "%" },
	];
	const bars = [96, 92, 88, 84, 82, 95];

	const findCardNumber = (label) => {
		const labelNode = Array.from(impact.querySelectorAll("div")).find((node) => node.textContent.trim() === label);
		const card = labelNode?.closest(".relative.rounded-2xl");
		return card?.querySelector(".tracking-tight span");
	};

	const easeOutCubic = (progress) => 1 - Math.pow(1 - progress, 3);
	const animateCounter = ({ label, value, suffix }) => {
		const node = findCardNumber(label);
		if (!node) return;

		if (prefersReducedMotion) {
			node.textContent = value.toLocaleString() + suffix;
			return;
		}

		const duration = 1600;
		const start = performance.now();
		const tick = (now) => {
			const progress = Math.min(1, (now - start) / duration);
			node.textContent = Math.round(value * easeOutCubic(progress)).toLocaleString() + suffix;
			if (progress < 1) requestAnimationFrame(tick);
		};
		requestAnimationFrame(tick);
	};

	const animateBars = () => {
		const fills = impact.querySelectorAll(".space-y-5 .h-2 > div");
		fills.forEach((fill, index) => {
			const width = `${bars[index] || 0}%`;
			if (prefersReducedMotion) {
				fill.style.transition = "none";
				fill.style.width = width;
				return;
			}
			fill.style.width = "0%";
			requestAnimationFrame(() => {
				fill.style.width = width;
			});
		});
	};

	const runImpactAnimation = () => {
		counters.forEach(animateCounter);
		animateBars();
	};

	if (!("IntersectionObserver" in window)) {
		runImpactAnimation();
		return;
	}

	const observer = new IntersectionObserver(([entry]) => {
		if (!entry.isIntersecting) return;
		runImpactAnimation();
		observer.disconnect();
	}, { threshold: 0.25 });

	observer.observe(impact);
})();


