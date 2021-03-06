'use strict';

function restore() {
  chrome.storage.local.get({
    'host': 'http://localhost:19455',
    'foramt': '[login] - [name]',
    'charset': 'qwertyuioplkjhgfdsazxcvbnmQWERTYUIOPLKJHGFDSAZXCVBNM1234567890',
    'length': 12,
    'embedded': false,
    'auto-login': false,
    'auto-submit': true,
    'faqs': true,
  }, prefs => {
    document.getElementById('host').value = prefs.host;
    document.getElementById('format').value = prefs.format;
    document.getElementById('charset').value = prefs.charset;
    document.getElementById('length').value = prefs.length;
    document.getElementById('embedded').checked = prefs.embedded;
    document.getElementById('auto-login').checked = prefs['auto-login'];
    document.getElementById('auto-submit-auto-login').checked = localStorage.getItem('auto-submit') === 'true';
    document.getElementById('auto-submit').checked = prefs['auto-submit'];
    document.getElementById('faqs').checked = prefs.faqs;
    document.getElementById('json').value = JSON.stringify(
      JSON.parse(localStorage.getItem('json') || '[]'),
      null,
      '  '
    );
  });
}

function save() {
  chrome.storage.local.set({
    'host': document.getElementById('host').value,
    'format': document.getElementById('format').value,
    'charset': document.getElementById('charset').value,
    'length': Math.max(document.getElementById('length').value, 3),
    'embedded': document.getElementById('embedded').checked,
    'auto-login': document.getElementById('auto-login').checked,
    'auto-submit': document.getElementById('auto-submit').checked,
    'faqs': document.getElementById('faqs').checked,
  }, () => {
    const status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(() => status.textContent = '', 750);
  });

  let json = [];
  try {
    json = JSON.parse(document.getElementById('json').value.trim() || '[]');
  }
  catch (e) {
    chrome.notifications.create({
      title: 'KeePassHelper',
      type: 'basic',
      iconUrl: '/data/icons/48.png',
      message: e.message
    });
  }
  localStorage.setItem('json', JSON.stringify(json));
  const checked = document.getElementById('auto-submit-auto-login').checked;
  localStorage.setItem('auto-submit', checked);
  chrome.runtime.sendMessage({
    cmd: 'register-login',
    'auto-submit': checked,
    json
  });
}

document.addEventListener('DOMContentLoaded', restore);
document.getElementById('save').addEventListener('click', save);
document.getElementById('example').addEventListener('click', () => {
  document.getElementById('json').value = JSON.stringify([{
    'url': 'https://github.com/login',
    'username': 'test.user@gmail.com'
  }], null, '  ');
});
document.getElementById('support').addEventListener('click', () => chrome.tabs.create({
  url: 'https://www.paypal.me/addondonation/10usd'
}));
