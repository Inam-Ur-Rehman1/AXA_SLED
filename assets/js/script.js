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
			<a class="mobile-nav__cta" href="https://calendly.com/axabiztechsled/30min" target="_blank" rel="noreferrer">Book Call</a>
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
	const section = document.getElementById("cases");
	if (!section) return;

	const tabs = Array.from(section.querySelectorAll(".past-tab[data-category]"));
	const grid = section.querySelector(".past-card-grid");
	if (!tabs.length || !grid) return;

	const cards = {
		kyc: [
			{
				kicker: "Biometric eKYC",
				badge: "80M+ verifications",
				title: "Biometric Verification — FLECK / Bio-Verisys (Nationwide)",
				subtitle: "Identity · KYC / eKYC · NADRA-class Integration",
				challenge: "Banks required real-time biometric identity verification at branch, ATM and mobile with full audit trail across 80M+ verifications.",
				solution: "Deployed FLECK & Bio-Verisys at Standard Chartered, Bank of Khyber, JS Bank. Directly mappable to U.S. SLED HHS, DMV, elections and benefits-eligibility identity workloads.",
				naics: ["541512", "541519"],
				nigp: ["209-36", "920-14"],
			},
			{
				kicker: "Screening & Risk",
				badge: "Multi-bank, multi-channel",
				title: "Onboarding & eKYC Suite — Agent / Merchant / Self",
				subtitle: "Citizen / Customer Onboarding",
				challenge: "Need for a single, audited onboarding stack covering agent, merchant and self-onboarding journeys with sanction / PEP / adverse-media screening.",
				solution: "Production onboarding suite with KYC/eKYC integration, sanction-list & PEP screening, transaction monitoring and adverse-media checks — mirrors U.S. SLED citizen-portal compliance demands.",
				naics: ["541512", "541611"],
				nigp: ["920-14", "918-29"],
			},
			{
				kicker: "AML / Sanctions",
				badge: "Continuous monitoring",
				title: "Screening & Risk Management Platform",
				subtitle: "Financial Crime · AML",
				challenge: "Real-time sanction screening, PEP detection, transaction monitoring and adverse-media surveillance for regulated entities.",
				solution: "Modular risk stack reused across banks & telcos. Same engine supports U.S. SLED grant integrity, vendor-screening and benefits-fraud programs.",
				naics: ["541512", "541690"],
				nigp: ["209-36", "920-78"],
			},
		],
		products: [
			["Platform Build", "Multi-million-user network", "Branchless Banking Platform — NRSP Bank", "Financial Services · State Bank Audited", "First locally designed branchless banking platform requiring full audit clearance, agent network rollout and core-banking integration.", "Built agent app, switch, settlement and KYC flows. Pattern maps to SLED citizen-services and digital-equity programs.", ["541512", "541511"], ["920-14", "920-78"]],
			["Loan Origination", "$2B+ disbursements", "Loan Origination System (LOS) — Mobilink Microfinance Bank", "Financial Services · Core Banking", "Bank needed a new LOS integrated with T24 core banking, supporting field-officer mobility and large-volume disbursements.", "Delivered mobile capture, credit scoring, document workflow and T24 integration for benefits and grant-management style workloads.", ["541512", "541611"], ["920-14", "918-29"]],
			["Managed Services", "Device estate", "Device Management & OTA — CMPak (Zong)", "Telecom · Field Operations", "Carrier needed unified OTA and device management across a fast-growing handset and IoT-device fleet.", "Stood up OTA lifecycle, policy and security platform for device programs, public-safety fleets and county IT asset estates.", ["541513", "541512"], ["920-78", "209-36"]],
			["Payments", "Agent / merchant rails", "Wallet, Payment & Settlement Platform", "Digital Payments · Transaction Processing", "Programs need secure payments, reconciliation and agent/merchant workflows with audit-ready transaction visibility.", "Built payment workflows, settlement, reporting and operational controls reusable for benefits, fee collection and grants.", ["541512", "522320"], ["946-25", "920-14"]],
			["Citizen Portals", "Self-service journeys", "Citizen / Customer Portal Framework", "Web · Mobile · Service Delivery", "Agencies need responsive portals that reduce counter traffic while preserving accessibility and identity controls.", "Delivered reusable portal patterns for onboarding, status tracking, document capture, service requests and notifications.", ["541511", "541512"], ["920-14", "915-96"]],
			["Data Exchange", "Integration-ready", "API Gateway & Integration Layer", "Middleware · Interoperability", "Legacy platforms and vendor systems need secure data exchange without disrupting current operations.", "Implemented API, middleware and event-driven integration foundations for cross-platform sync and reporting.", ["541512", "541519"], ["920-78", "920-45"]],
			["AI / ML", "Language access", "Language Transliteration & Translation Engine", "Banking & Insurance · AI/ML", "Customer communications and compliance workflows required accurate transliteration and translation across scripts.", "Built AI/ML models directly applicable to SLED language-access mandates for DOH, DMV and election services.", ["541511", "541512"], ["920-78", "920-14"]],
			["Compliance", "Audit trails", "Compliance Workflow & Case Management", "Risk · Reviews · Approvals", "Regulated workflows need evidence capture, approval chains, exceptions and audit history in one operating view.", "Delivered workflow controls, role-based queues, document trails and reporting for audit-ready operations.", ["541512", "541611"], ["918-29", "920-14"]],
			["Reporting", "Executive visibility", "BI Dashboard & Operational Analytics", "Data · Reporting · KPI Monitoring", "Leadership teams need real-time delivery, transaction and risk visibility across distributed programs.", "Built dashboards, metrics pipelines and reports for program operations, compliance reviews and executive status.", ["541511", "541512"], ["920-78", "918-29"]],
			["Core Systems", "Modernization", "Legacy Modernization Product Modules", "Enterprise · Migration · Support", "Older systems need incremental modernization without creating a large replacement risk for public-sector programs.", "Delivered reusable modules for migration, integration, QA, support and phased rollout into active operations.", ["541512", "541519"], ["920-14", "920-78"]],
		].map(([kicker, badge, title, subtitle, challenge, solution, naics, nigp]) => ({ kicker, badge, title, subtitle, challenge, solution, naics, nigp })),
		resources: [
			["Software Dev", "Dedicated pods", "Software Engineering Squads", "Web · Mobile · Microservices · Enterprise", "Primes need ramp-up of cleared, time-zone-aligned engineers for SLED build phases without local hiring lag.", "Dedicated offshore squads: Web & Mobile App Dev, Microservices Architecture, Enterprise Solutions, Seamless Backend Logic. Onboarded in days, not months.", ["541511", "541512"], ["918-29", "920-78"]],
			["AI / ML / Data", "Senior bench", "AI / ML & Data Engineering", "Intellect Practice", "SLED Primes increasingly need AI/ML, cognitive data architecture, advanced DB design and system-logic optimization.", "Bench of AI/ML engineers, data architects and DBAs ready to plug into Prime delivery teams for analytics, automation and modernization scopes.", ["541511", "541512"], ["920-78", "209-36"]],
			["DevOps / Security", "24×5 coverage", "DevOps · CI/CD · InfoSec (VA/PT)", "Evolution Practice", "Primes need DevOps pipelines, VA/PT, managed IT/QA support and infrastructure deployment for SLED programs.", "DevOps & CI/CD engineers, InfoSec (VA/PT) specialists, Managed IT & QA support, Infrastructure Deployment teams — directly augmentable into Prime SDLC.", ["541512", "541519"], ["209-36", "920-78"]],
			["Hardware / Embedded", "OEM / ODM", "Embedded / Hardware / PCB Engineers", "Blueprint + Hardware Practice", "Niche SLED scopes such as public safety, transit, K-12 STEM, smart-city and embedded systems need RF, PCB and DFM engineers.", "Embedded engineers, RF specialists and PCB teams for prototype-to-production hardware, firmware, testing and OEM/ODM delivery support.", ["541330", "541512"], ["206-87", "920-78"]],
			["Integrations", "Plug-in pods", "Integrations & Legacy Migration", "Integrations Practice", "Primes face heavy SLED system-integration scope: API connectors, cross-platform sync, interoperability and legacy migration.", "Integration pods for APIs, middleware, data migration, platform modernization and QA support across public-sector enterprise environments.", ["541512", "541519"], ["920-14", "920-78"]],
			["Proposal Support", "Surge bench", "Proposal / Capture / Bid Support", "RFP / RFQ Response", "Primes need surge capacity for SLED proposal writing, technical volumes, compliance matrices and pricing support.", "Proposal, capture and bid-support resources aligned to Prime deadlines, technical narratives, code mapping and production-ready submission packages.", ["541611", "541990"], ["918-29", "961-53"]],
		].map(([kicker, badge, title, subtitle, challenge, solution, naics, nigp]) => ({ kicker, badge, title, subtitle, challenge, solution, naics, nigp })),
	};

	const escapeHtml = (value) => String(value)
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;");

	const codeBadges = (items, red = false) => items
		.map((item) => `<span${red ? ' class="red"' : ""}>${escapeHtml(item)}</span>`)
		.join("");

	const renderCard = (card) => `
		<article class="past-card"><div class="past-card-stripe"></div><div class="past-card-head"><span>${escapeHtml(card.kicker)}</span><small>${escapeHtml(card.badge)}</small></div><h3>${escapeHtml(card.title)}</h3><div class="past-card-subtitle">${escapeHtml(card.subtitle)}</div><div class="past-card-body"><h4>Challenge</h4><p>${escapeHtml(card.challenge)}</p><h4>Delivered Solution</h4><p>${escapeHtml(card.solution)}</p></div><div class="past-card-codes"><div><b>NAICS</b>${codeBadges(card.naics)}</div><div><b>NIGP</b>${codeBadges(card.nigp, true)}</div></div><div class="past-card-links"><a href="#prebid">Add to Pre-Bid →</a><a href="https://calendly.com/axabiztechsled/30min" target="_blank" rel="noreferrer">Book call</a></div></article>
	`;

	const selectCategory = (category) => {
		const nextCards = cards[category];
		if (!nextCards) return;

		tabs.forEach((tab) => {
			const selected = tab.dataset.category === category;
			tab.classList.toggle("is-active", selected);
			tab.setAttribute("aria-selected", selected ? "true" : "false");
		});
		grid.innerHTML = nextCards.map(renderCard).join("");
	};

	tabs.forEach((tab) => {
		tab.addEventListener("click", () => selectCategory(tab.dataset.category));
	});
	selectCategory(tabs.find((tab) => tab.classList.contains("is-active"))?.dataset.category || "resources");
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


