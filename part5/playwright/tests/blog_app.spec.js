const { test, expect, describe, beforeEach } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'testName',
        username: 'testUsername',
        password: 'testPassword'
      }
    })
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'testName2',
        username: 'testUsername2',
        password: 'testPassword2'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = await page.getByRole('button', { name: 'login' })
    await expect(locator).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByTestId('username').fill('testUsername')
      await page.getByTestId('password').fill('testPassword')
      await page.getByRole('button', { name: 'login' }).click()
    
      await expect(page.getByText('testName logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByTestId('username').fill('testUsername')
      await page.getByTestId('password').fill('wrongPassword')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('wrong username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByTestId('username').fill('testUsername')
      await page.getByTestId('password').fill('testPassword')
      await page.getByRole('button', { name: 'login' }).click()
    })
  
    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByTestId('title').fill('testTitle')
      await page.getByTestId('author').fill('testAuthor')
      await page.getByTestId('url').fill('testUrl')
      await page.getByRole('button', { name: 'create' }).click()
      await expect(await page.getByText('testTitle testAuthor')).toBeVisible()
    })

    describe('After creating a note', () => {
      beforeEach(async ({ page }) => {
        await page.getByRole('button', { name: 'new blog' }).click()
        await page.getByTestId('title').fill('testTitle')
        await page.getByTestId('author').fill('testAuthor')
        await page.getByTestId('url').fill('testUrl')
        await page.getByRole('button', { name: 'create' }).click()
      })

      test('a blog can be edited', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(await page.getByText('likes 1')).toBeVisible()
      })
  
      test('a blog can be deleted', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        page.once('dialog', dialog => {
          dialog.accept(); 
        });
        await page.getByRole('button', { name: 'remove' }).click()
  
        await expect(await page.getByText('testTitle testAuthor')).not.toBeVisible()
      })

      test('another user cannot see the delete button', async ({ page }) => {
        await page.getByRole('button', { name: 'logout' }).click()
        await page.getByTestId('username').fill('testUsername2')
        await page.getByTestId('password').fill('testPassword2')
        await page.getByRole('button', { name: 'login' }).click()
        await page.getByRole('button', { name: 'view' }).click()
    
        await expect(await page.getByText('remove')).not.toBeVisible()
      })

      test('blogs are ordered by likes', async ({ page }) => {
        await page.getByRole('button', { name: 'new blog' }).click()
        await page.getByTestId('title').fill('testTitle2')
        await page.getByTestId('author').fill('testAuthor2')
        await page.getByTestId('url').fill('testUrl2')
        await page.getByRole('button', { name: 'create' }).click()

        await (page.getByRole('button', { name: 'view' }).all())[1].click()
        await page.getByRole('button', { name: 'like' }).click()
        await page.getByRole('button', { name: 'hide' }).click()

        const viewButtonsAfter = await page.getByRole('button', { name: 'view' }).all()
        viewButtonsAfter[0].click()
    
        await expect(await page.getByText('testUrl2')).toBeVisible()
      })
    })
  })
})