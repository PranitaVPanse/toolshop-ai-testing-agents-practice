# TS-3 Customer sends a message to Toolshop through the Contact form

**Type:** Story
**Status:** Draft

## Summary

Add a Contact page with a form where a customer can send a message to Toolshop. The customer
enters their name and email, picks a subject, writes a message and can attach a text file. The
form checks the input before sending and confirms when the message has been sent.

## Story

As a customer (visitor or logged-in)
I want to send a message to Toolshop from the website
So that I can get help with a question, a return, a payment or an order

## Description

Customers need a simple way to reach Toolshop without leaving the site. The Contact page is
reached from **Contact** in the main menu (`/contact`). It has the heading "Contact" and the page
title "Contact Us".

The form has these fields:

| Field | Type | Required | Rule |
|---|---|---|---|
| First name | Text | Yes | Must not be empty |
| Last name | Text | Yes | Must not be empty |
| Email address | Email | Yes | Must be a valid email format |
| Subject | Drop-down | Yes | One of: Customer service, Webmaster, Return, Payments, Warranty, Status of my order |
| Message | Text area | Yes | At least 50 characters |
| Attachment | File | No | `.txt` files only, and the file must be 0 KB |

The **Send** button submits the form. If any field is wrong, the form shows a message under that
field and does not send. If everything is correct, the message is sent and the customer sees a
confirmation.

## Acceptance criteria

1. **Navigation.** The main menu has **Contact**. Selecting it opens the Contact page at
   `/contact` with the heading "Contact" and the page title "Contact Us".
2. **Form fields.** The form shows First name, Last name, Email address, Subject, Message and
   Attachment, each with a label, and a **Send** button. Required fields are marked with `*`.
3. **Subject options.** The Subject drop-down starts at "Select a subject" and offers Customer
   service, Webmaster, Return, Payments, Warranty and Status of my order.
4. **Required fields.** When the customer selects **Send** with required fields empty, the form
   is not sent and each empty field shows its message:
   - "First name is required"
   - "Last name is required"
   - "Email is required"
   - "Subject is required"
   - "Message is required"
5. **Email format.** When the email is not a valid address (for example `not-an-email`), the form
   is not sent and shows "Email format is invalid".
6. **Message length.** When the message has fewer than 50 characters, the form is not sent and
   shows "Message must be minimal 50 characters". A message of exactly 50 characters is accepted.
7. **Attachment type.** The attachment accepts `.txt` files only. Choosing another file type
   shows an error and the form is not sent.
8. **Attachment size.** The hint under Attachment reads "Only files with the txt extension are
   allowed, and files must be 0kb." A `.txt` file larger than 0 KB shows an error and the form is
   not sent.
9. **Errors clear.** When the customer corrects a field, its error message disappears.
10. **Successful send.** When all required fields are valid (with or without a valid
    attachment), selecting **Send** sends the message. The form is replaced by a confirmation
    message telling the customer that Toolshop will contact them.
11. **Logged-in customer.** For a logged-in customer, their name and email come from their
    account, so they only need to choose a subject and write a message.
12. **Language.** All labels, placeholders, subject options, hints and error messages are
    translated when the customer changes the language.

## In scope

- Contact entry in the main menu and the Contact page (`/contact`)
- All form fields, labels, placeholders and the Subject options
- Field validation and error messages (required, email format, message length, attachment)
- Optional `.txt` attachment
- Confirmation after a successful send
- Behaviour for visitors and logged-in customers
- Translated labels and messages

## Out of scope

- Sending emails to the customer or to Toolshop staff
- Admin view of received messages and replying to them
- Attachments other than `.txt`, and multiple attachments
- CAPTCHA, spam filtering and rate limiting
- Live chat (the chat button on the page)
- Phone number, postal address or map on the Contact page
- Performance, load and security testing

## Assumptions and dependencies

- Messages are stored through the Toolshop API and can be viewed by an admin.
- The confirmation is shown on the same page. The customer is not redirected.
- The 0 KB attachment limit is intentional for this sprint.

## Definition of done

- All acceptance criteria pass on the local environment.
- Open questions are answered and the acceptance criteria are updated to match.
- The exploratory testing report for this story is signed off by the QA engineer.
