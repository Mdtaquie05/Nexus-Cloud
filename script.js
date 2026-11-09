// 1. Scroll Reveal Animations
const revealItems = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.1 });

revealItems.forEach(el => revealObs.observe(el));

// 2. FIXED: Left Sidebar 6-Tab Switching Inside Dashboard Console
const sidebarLinks = document.querySelectorAll('#dash-sidebar-nav li');
const dashPanels = document.querySelectorAll('.dash-panel');
const windowUrl = document.getElementById('window-url');

sidebarLinks.forEach(item => {
    item.addEventListener('click', () => {
        // Highlight clicked sidebar item
        sidebarLinks.forEach(li => li.classList.remove('active'));
        item.classList.add('active');

        // Show matching dashboard panel
        const targetTab = item.getAttribute('data-tab');
        dashPanels.forEach(panel => {
            panel.classList.remove('active');
        });
        document.getElementById(`panel-${targetTab}`).classList.add('active');

        // Update simulated browser address bar
        windowUrl.textContent = `app.nexuscloud.io/workspace/${targetTab}`;
    });
});

// 3. FIXED: Sign In & Start Free Trial Modal Logic
const authModal = document.getElementById('auth-modal');
const openAuthBtns = document.querySelectorAll('.open-auth');
const closeAuthBtn = document.getElementById('close-auth-modal');
const authTabs = document.querySelectorAll('.auth-tab');
const signupNameField = document.getElementById('signup-name-field');
const authHeading = document.getElementById('auth-heading');
const authSub = document.getElementById('auth-sub');
const authSubmitBtn = document.getElementById('auth-submit-btn');
const authForm = document.getElementById('auth-form');
const authFormView = document.getElementById('auth-form-view');
const authSuccessView = document.getElementById('auth-success-view');
const goToConsoleBtn = document.getElementById('go-to-console-btn');
const navAuthArea = document.getElementById('nav-auth-area');
const wsTitle = document.getElementById('ws-title');

let currentAuthMode = 'signin';

function setAuthMode(mode, planName = '') {
    currentAuthMode = mode;
    authFormView.style.display = 'block';
    authSuccessView.style.display = 'none';

    authTabs.forEach(tab => {
        tab.classList.toggle('active', tab.getAttribute('data-target') === mode);
    });

    if (mode === 'signup') {
        signupNameField.style.display = 'block';
        authHeading.textContent = planName ? `Start ${planName} Free Trial` : 'Start Your 14-Day Free Trial';
        authSub.textContent = 'Deploy unlimited apps with ₹10,000 free cloud credits. No card required.';
        authSubmitBtn.innerHTML = 'Create Free Cloud Account <i class="fa-solid fa-rocket"></i>';
    } else {
        signupNameField.style.display = 'none';
        authHeading.textContent = 'Welcome Back to NexusCloud';
        authSub.textContent = 'Sign in to manage your production clusters and deployments.';
        authSubmitBtn.innerHTML = 'Sign In to Console <i class="fa-solid fa-arrow-right"></i>';
    }
}

openAuthBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-mode') || 'signin';
        const plan = btn.getAttribute('data-plan') || '';
        setAuthMode(mode, plan);
        authModal.classList.add('open');
    });
});

authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        setAuthMode(tab.getAttribute('data-target'));
    });
});

closeAuthBtn.addEventListener('click', () => authModal.classList.remove('open'));
authModal.addEventListener('click', (e) => {
    if (e.target === authModal) authModal.classList.remove('open');
});

// Handle Form Submit & OAuth Click
function completeAuthentication(userName) {
    authFormView.style.display = 'none';
    authSuccessView.style.display = 'block';

    const cleanName = userName || 'Taquie';
    document.getElementById('success-title').textContent = `Welcome, ${cleanName}!`;
    wsTitle.textContent = `${cleanName}'s Cluster`;

    // Update top navbar to show logged-in user badge
    navAuthArea.innerHTML = `
        <span class="status-ready"><i class="fa-solid fa-circle-user"></i> ${cleanName} (Pro Trial)</span>
    `;
}

authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('auth-name').value.trim();
    const emailInput = document.getElementById('auth-email').value.trim();
    const displayUser = nameInput || emailInput.split('@')[0];

    authSubmitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Authenticating...';
    setTimeout(() => {
        completeAuthentication(displayUser);
    }, 700);
});

document.getElementById('github-oauth').addEventListener('click', () => completeAuthentication('GitHub Dev'));
document.getElementById('google-oauth').addEventListener('click', () => completeAuthentication('Taquie Arif'));

goToConsoleBtn.addEventListener('click', () => {
    authModal.classList.remove('open');
    document.getElementById('dashboard').scrollIntoView({ behavior: 'smooth' });
});

// 4. Interactive Hero Dashboard Timeframe Switcher (24H / 7D / 30D / 1Y)
const timeBtns = document.querySelectorAll('.time-btn');
const kpiRequests = document.getElementById('kpi-requests');
const kpiLatency = document.getElementById('kpi-latency');
const kpiRevenue = document.getElementById('kpi-revenue');
const kpiThreats = document.getElementById('kpi-threats');
const bars = document.querySelectorAll('#bar-chart .bar');

const telemetryData = {
    '24h': { requests: '342K', latency: '14ms', revenue: '₹1,18,400', threats: '2,140', heights: [42, 58, 75, 64, 88, 79, 94] },
    '7d':  { requests: '2.48M', latency: '18ms', revenue: '₹8,42,500', threats: '14,920', heights: [48, 65, 58, 86, 74, 92, 81] },
    '30d': { requests: '11.6M', latency: '17ms', revenue: '₹34,90,000', threats: '62,800', heights: [62, 70, 84, 78, 91, 88, 96] },
    '1y':  { requests: '148M', latency: '16ms', revenue: '₹4.12 Cr', threats: '710K', heights: [55, 68, 74, 82, 89, 93, 98] }
};

timeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        timeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const data = telemetryData[btn.getAttribute('data-range')];
        kpiRequests.textContent = data.requests;
        kpiLatency.textContent = data.latency;
        kpiRevenue.textContent = data.revenue;
        kpiThreats.textContent = data.threats;

        bars.forEach((bar, i) => {
            const h = data.heights[i];
            bar.style.height = `${h}%`;
            bar.querySelector('span').textContent = `${h}k`;
        });
    });
});

// 5. Live Deployment Simulator Buttons (Overview + Deployments Tab)
const deployBtn = document.getElementById('trigger-deploy-btn');
const panelDeployBtn = document.getElementById('panel-deploy-btn');
const deployList = document.getElementById('deploy-list');
const fullDeployTable = document.getElementById('full-deploy-table');
const deployBadge = document.getElementById('deploy-badge');
const deployStatusText = document.getElementById('deploy-status-text');

let deployCounter = 14;
const sampleCommits = [
    'feat: edge-redis-cluster-sync',
    'perf: image-webp-optimizer',
    'fix: razorpay-upi-webhook',
    'ui: dark-mode-bento-v3'
];

function triggerSimulatedDeploy(buttonEl) {
    const originalHTML = buttonEl.innerHTML;
    buttonEl.disabled = true;
    buttonEl.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Deploying...';
    deployStatusText.textContent = 'Building...';

    setTimeout(() => {
        deployCounter++;
        deployBadge.textContent = deployCounter;
        deployStatusText.textContent = 'Ready';
        buttonEl.disabled = false;
        buttonEl.innerHTML = originalHTML;

        const randomCommit = sampleCommits[Math.floor(Math.random() * sampleCommits.length)];
        const randomHash = Math.random().toString(16).substring(2, 9);

        // Add to Overview mini list
        const newRow = document.createElement('div');
        newRow.className = 'deploy-item';
        newRow.innerHTML = `
            <span class="d-status success"><i class="fa-solid fa-check"></i></span>
            <div class="d-info">
                <strong>${randomCommit}</strong>
                <small>main • ${randomHash} • 0.8s build</small>
            </div>
            <span class="d-time">Just now</span>
        `;
        deployList.prepend(newRow);
        if (deployList.children.length > 3) deployList.lastElementChild.remove();

        // Add to Deployments Tab full table
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${randomCommit}</strong><br><small>main • commit #${randomHash}</small></td>
            <td><span class="env-pill prod">Production</span></td>
            <td>0.8s</td>
            <td><span class="status-ready">● Live Now</span></td>
        `;
        fullDeployTable.prepend(tr);
    }, 800);
}

deployBtn.addEventListener('click', () => triggerSimulatedDeploy(deployBtn));
panelDeployBtn.addEventListener('click', () => triggerSimulatedDeploy(panelDeployBtn));

// Copy DB Connection Button & Invoice Button Feedback
const copyConnBtn = document.getElementById('copy-conn-btn');
copyConnBtn.addEventListener('click', () => {
    copyConnBtn.innerHTML = '<i class="fa-solid fa-check"></i> URI Copied!';
    setTimeout(() => {
        copyConnBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy Connection URI';
    }, 2000);
});

const downloadInvoiceBtn = document.getElementById('download-invoice-btn');
downloadInvoiceBtn.addEventListener('click', () => {
    downloadInvoiceBtn.innerHTML = '<i class="fa-solid fa-check"></i> GST Invoice Downloaded!';
    setTimeout(() => {
        downloadInvoiceBtn.innerHTML = '<i class="fa-solid fa-file-arrow-down"></i> Download GST Invoice';
    }, 2000);
});

// 6. Bento Multi-Framework Code Switcher
const codeTabs = document.querySelectorAll('.code-tab');
const codeDisplay = document.getElementById('code-display');

const codeSnippets = {
    nextjs: `// 1. nexus.config.js — Auto Edge Deployment
import { defineCluster } from '@nexuscloud/sdk';

export default defineCluster({
  region: ['bom1-mumbai', 'sin1-singapore'],
  framework: 'nextjs-15',
  autoScale: { minNodes: 2, maxNodes: 30 },
  redisCache: true
});`,
    nodejs: `// 2. server.js — High-Throughput Node API
import express from 'express';
import { edgeCache } from '@nexuscloud/node';

const app = express();
app.use(edgeCache({ ttl: '60s', staleWhileRevalidate: true }));

app.get('/api/v1/orders', (req, res) => {
  res.json({ status: 'ok', latency: '11ms', region: 'Mumbai' });
});`,
    wordpress: `# 3. nexus-wp.yml — High-Speed WooCommerce Stack
runtime: php-8.3-litespeed
database: mariadb-nvme-cluster
cache:
  object_cache: redis-7.2
  full_page_cdn: active
security:
  waf_ddos_shield: strict`
};

codeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        codeTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        codeDisplay.innerHTML = `<code>${codeSnippets[tab.getAttribute('data-lang')]}</code>`;
    });
});

// 7. Bento Live Cloud Cost Calculator
const cloudSlider = document.getElementById('cloud-slider');
const trafficLabel = document.getElementById('traffic-label');
const awsCostEl = document.getElementById('aws-cost');
const nexusCostEl = document.getElementById('nexus-cost');
const savingsBanner = document.getElementById('savings-banner');

cloudSlider.addEventListener('input', () => {
    const step = parseInt(cloudSlider.value);
    const visits = step * 100000;
    const awsMonthly = step * 3700;
    const nexusMonthly = step * 1500;
    const yearlySavings = (awsMonthly - nexusMonthly) * 12;

    trafficLabel.textContent = `${visits.toLocaleString('en-IN')} Visits / mo`;
    awsCostEl.innerHTML = `₹${awsMonthly.toLocaleString('en-IN')}<span>/mo</span>`;
    nexusCostEl.innerHTML = `₹${nexusMonthly.toLocaleString('en-IN')}<span>/mo</span>`;
    savingsBanner.innerHTML = `🎉 You Save <strong>₹${yearlySavings.toLocaleString('en-IN')} / year</strong> with NVMe Edge Caching`;
});

// 8. Dual Pricing Switcher (INR/USD + Monthly/Yearly)
const currBtns = document.querySelectorAll('.curr-btn');
const billingCheckbox = document.getElementById('billing-checkbox');
const priceVals = document.querySelectorAll('.p-val');
const billM = document.getElementById('bill-m');
const billY = document.getElementById('bill-y');

let activeCurrency = 'INR';

function updatePrices() {
    const isYearly = billingCheckbox.checked;
    billM.classList.toggle('active', !isYearly);
    billY.classList.toggle('active', isYearly);

    priceVals.forEach(val => {
        const key = `data-${activeCurrency.toLowerCase()}-${isYearly ? 'y' : 'm'}`;
        val.textContent = val.getAttribute(key);
    });
}

currBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        currBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCurrency = btn.getAttribute('data-curr');
        updatePrices();
    });
});

billingCheckbox.addEventListener('change', updatePrices);

// 9. FAQ Accordion
document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
        btn.parentElement.classList.toggle('active');
    });
});