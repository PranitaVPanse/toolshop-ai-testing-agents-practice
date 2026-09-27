@login
Feature: Login
  Registered users sign in to reach their own area of the Toolshop.

  Background:
    Given I am on the login page

  @smoke
  Scenario: Customer logs in with valid credentials
    When I log in as the customer
    Then I am taken to "/account"
    And I see the My account page
    And I am signed in

  @smoke
  Scenario: Admin logs in and lands on the admin dashboard
    When I log in as the admin
    Then I am taken to "/admin/dashboard"
    And I am signed in

  # Uses an address with no account behind it, so no real account collects failed attempts and gets locked.
  Scenario: Login is rejected for an unknown user
    When I log in with email "nobody@example.com" and password "wrong-password-1"
    Then I see the login error "Invalid email or password"
    And I am still on the login page

  Scenario: Email and password are required
    When I submit the login form without entering anything
    Then I see the email error "Email is required"
    And I see the password error "Password is required"
    And I am still on the login page
