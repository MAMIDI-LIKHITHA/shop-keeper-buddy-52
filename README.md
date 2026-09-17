# Product Hub

I need you to implement a REAL working product management system for this website.

Do not create a visual mockup of an admin panel. The product management functionality must actually work.

1. PRODUCT DATABASE

Create a database table for products with these fields:

id

name

description

price

category

image_url

available

featured

sort_order

created_at

updated_at

The public website must load products dynamically from the database.

Do NOT hard-code the product cards into the frontend.

2. ADMIN LOGIN

Create a secure admin login page at:

/admin/login

The client must be able to log in with an email and password.

After successful authentication, redirect them to:

/admin

Do not expose the admin dashboard or product-management functions to normal website visitors.

Use the project's authentication system and secure the admin routes.

3. ADMIN DASHBOARD

Create a clean, simple dashboard at /admin.

Show:

Total products

Featured products

Available products

Unavailable products

Add a prominent:

+ Add Product

button.

Also display the existing products in a management table/grid.

Each product should have:

Image thumbnail

Product name

Category

Price

Availability

Featured status

Edit button

Delete button

4. ADD PRODUCT

When the client clicks Add Product, open a form with:

Product name

Description

Price

Category

Product image upload

Available toggle

Featured toggle

Save Product button

Cancel button

When Save Product is clicked:

Upload the image to persistent storage.

Save the image URL in the product database record.

Save all other product information.

Return to the product dashboard.

Immediately show the new product on the public website.

Do not use temporary browser/local storage for products or images.

5. EDIT PRODUCT

Every product must have a working Edit button.

The client must be able to change:

Product name

Description

Price

Category

Product image

Availability

Featured status

When the client replaces an image, upload the new image and update the database record.

The public website should immediately reflect the changes.

6. DELETE PRODUCT

Add a working Delete button.

Before deletion, display:

“Are you sure you want to delete this product?”

If confirmed, delete the product from the database and remove its associated image where appropriate.

7. IMAGE UPLOAD

Implement REAL image uploading using persistent storage.

Requirements:

JPG

JPEG

PNG

WebP

Image preview before saving

Replace existing image

Remove image

Reasonable file-size validation

Responsive image display

Do not use fake upload buttons.

Do not use base64 images stored inside the database.

Do not use temporary blob URLs as the permanent product image.

Store uploaded images in the project's persistent storage and save their URLs in the database.

8. PRODUCT CATEGORIES

Allow the client to assign a category to each product.

Create a category dropdown in the Add/Edit Product form.

Use a simple structure that can be expanded later.

9. FEATURED PRODUCTS

If featured = true, display the product in the Featured Products section on the homepage.

If the client changes the Featured toggle in the admin dashboard, the homepage should update automatically.

10. AVAILABILITY

If available = true:

Display:

“Available”

If available = false:

Display:

“Currently Unavailable”

Do not show unavailable products as available.

11. PUBLIC PRODUCTS PAGE

Create a public /products page.

Load all products dynamically from the database.

Add:

Product grid

Product images

Product name

Description

Price

Availability

Category

Contact button

Add category filtering if there are multiple categories.

Add search if the product count becomes large.

12. HOMEPAGE

The homepage Products section must also load dynamically from the database.

Do not duplicate product information in the code.

The homepage should automatically update when the client adds, edits, or deletes products from /admin.

13. WHATSAPP

Create a central business WhatsApp setting in the admin configuration.

The client should be able to update the WhatsApp number without editing code.

Product contact buttons should use that number dynamically.

Use a message such as:

“Hi, I'm interested in [PRODUCT NAME].”

The product name should be inserted automatically into the message.

14. ADMIN SETTINGS

Create an Admin Settings section where the client can edit:

Business name

Logo

WhatsApp number

Phone number

Email

Instagram URL

Business description

Qatar/Dubai service areas

Store these settings persistently.

The public website should retrieve them dynamically.

15. SECURITY

Implement proper authentication and authorization.

Only authenticated administrators can:

Add products

Edit products

Delete products

Upload product images

Change business settings

Normal visitors must only be able to view public product information.

Do not expose database credentials, storage credentials, API keys, or admin secrets in frontend code.

Use appropriate database security policies so unauthenticated visitors cannot modify product records.

16. RESPONSIVE ADMIN DASHBOARD

The admin dashboard must work on:

Desktop

Laptop

Tablet

Mobile

On mobile, convert the product table into clean product cards so the client can manage products comfortably from a phone.

17. INITIAL DATA

Create 6–8 generic placeholder products so I can demonstrate the website.

Use clearly generic placeholder names such as:

Product One

Product Two

Product Three

Product Four

Product Five

Product Six

Use placeholder images.

The client will replace these with their actual product information and images after the website is handed over.

18. IMPORTANT IMPLEMENTATION REQUIREMENT

After implementing this, TEST the complete workflow yourself:

Create an admin account.

Log in.

Add a product.

Upload an image.

Save it.

Confirm it appears on /products.

Confirm it appears on the homepage.

Edit the product.

Replace its image.

Confirm the changes appear publicly.

Toggle availability.

Confirm the public status changes.

Toggle Featured.

Confirm it appears/disappears from Featured Products.

Delete the product.

Confirm it disappears from the public website.

Log out.

Confirm /admin cannot be accessed without authentication.

Fix any errors discovered during testing.

Do not tell me that the functionality is implemented unless the actual database, authentication, storage, CRUD operations, and frontend integration are working.

Keep the existing premium website design intact while implementing this functionality.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/50b1d6aa-0d24-433d-9aa9-df860038a8ff).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
