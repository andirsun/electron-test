/* eslint-disable import/no-extraneous-dependencies */
const {test, expect} = require('@playwright/test')
const path  = require('path') 
const { _electron: electron } = require('playwright');

let window
let electronApp

test.beforeAll(async () => {
  // Launch Electron app.
  electronApp = await electron.launch({
    args: [path.join(__dirname, '../app/background.js')],
  })

  // Evaluation expression in the Electron context.
  const isPackaged = await electronApp.evaluate(async ({app}) => {
    return app.isPackaged
  })

  expect(isPackaged).toBe(false)

  // Get the first window that the app opens, wait if necessary.
  window = await electronApp.firstWindow()

  // Capture a screenshot.
  await window.screenshot({
    path: path.join(__dirname, './screenshots/screenshot.png'),
  })

  // Direct Electron console to Node terminal.
  // eslint-disable-next-line no-console
  window.on('console', console.log)

  electronApp.on('window', async (page) => {
    // capture errors
    page.on('pageerror', (error) => {
      console.error(error)
    })
    // capture console messages
    page.on('console', (msg) => {
      console.log(msg.text())
    })
  })
})

let page
test('renders the first page', async () => {
  page = await electronApp.firstWindow()
  const title = await page.title()
  expect(title).toBe('')
})

test.afterAll(async () => {
  // Exit app.
  await electronApp.close()
})
