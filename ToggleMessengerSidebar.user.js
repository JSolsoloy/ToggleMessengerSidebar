// ==UserScript==
// @name         Collapsible Facebook Messenger Sidebar
// @namespace    https://github.com/habeebweeb
// @description  Adds a button to collapse the left sidebar
// @version      2.2.0
// @author       habeebweeb
// @icon         https://static.xx.fbcdn.net/rsrc.php/y7/r/O6n_HQxozp9.ico
// @license      GNU GPLv3; https://www.gnu.org/licenses/gpl-3.0.txt
// @include      https://www.messenger.com/*
// @include      https://www.facebook.com/messages/t/*
// @include      https://m.me/*
// @grant        GM.setValue
// @grant        GM.getValue
// ==/UserScript==

(() => {
  'use strict'

  const classes = {
    container: '_2sdm',
    body: '_4sp8',
    header: '_673w',
    headerName: '_5743',
    left: '_1enh',
    right: '_4_j5',
    conversationContainer: '_1t2u',
    hidden: 'hidden_elem'
  }

  const messengerHook = setInterval(initialize, 100)

  function initialize () {
    const body = document.getElementsByClassName(classes.body)[0]

    if (!body) return

    GM.getValue('_sidebarOpen')
      .then(state => {
        const sidebarButton = new Button(state)

        try {
          addButton(sidebarButton)
          const observer = new MutationObserver(mutationList => {
            addButton(sidebarButton)
          })
          observer.observe(body, { childList: true })
        } catch (e) {
          console.warn('Unable to add sidebar button. Refresh to fix')
        } finally {
          clearInterval(messengerHook)
        }
      })
  }

  function addButton (sidebarButton) {
    const header = document.getElementsByClassName(classes.header)[0]
    header.appendChild(sidebarButton.button)
  }

  function Button (state) {
    this.open = state !== undefined ? state : true
    this.sidebar = document.getElementsByClassName(classes.left)[0]
    this.button = (() => {
      const button = document.createElement('span')
      button.innerText = '☰'
      button.style.left = '11px'
      button.style.bottom = '13px'
      button.style.width = '25px'
      button.style.height = '25px'
      button.style.position = 'absolute'
      button.style['font-size'] = '1.6em'
      button.style['line-height'] = '1em'
      button.style.cursor = 'pointer'
      button.style.color = '#888'
      return button
    })()
    this.manageSidebar = function () {
      if (this.open) {
        this.sidebar.classList.remove(classes.hidden)
      } else {
        this.sidebar.classList.add(classes.hidden)
      }
    }
    this.button.addEventListener('click', () => {
      this.open = !this.open
      GM.setValue('_sidebarOpen', this.open)
        .then(() => this.manageSidebar())
    })
    this.manageSidebar()
  }
})()
