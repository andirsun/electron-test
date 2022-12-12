/* eslint-disable import/no-extraneous-dependencies */
const {test, expect} = require('@playwright/test') 
const { _electron: electron } = require('playwright');

let electronApp

test.beforeAll(async () => {
  // Launch Electron app.
  electronApp = await electron.launch({
    args: ['.'],
  })
})

let page
test('renders the first page', async () => {
  page = await electronApp.firstWindow()
  const title = await page.title()
  expect(title).toBe('Home - Nextron (store-data)')
})

test.afterAll(async () => {
  // Exit app.
  await electronApp.close()
})
