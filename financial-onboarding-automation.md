# Automation of Financial Onboarding Process

## Context 
The financial onboarding process allows users to publish paid plans for their app in marketplace. This process occurs when the user does one of the following:
a. Requests publish on a draft app containing a paid plan:
b. Creates a paid plan on an unverified app and initiates financial onboarding

Requirements:
1. Organization must be a verified publisher
2. The app applying for the marketplace listing must have 100 installs

## Intent
- Automating the issue creation when user requests to publish with a paid plan or initiates financial onboarding
- Sending an email to the user with a google form to collect some basic information required for the payment enrollment

## Behind the scenes

A new module `FinancialOnboardingHelper` has been created to provide helper functions for facilitating issue creation and sending email using MarketplaceMailer.

1. For draft apps applying to publish with paid plan
* The `Marketplace::Listings::VerifiedApprovalRequestsController` class is used to change the state of app from `draft` to `verification_pending_from_draft` using the `create` method
* Within this method, we call `create_issue_in_marketplace` method from FinancialOnboardingHelper module which is responsible for creating an issue in `github/marketplace` repository. 

```
def create_issue_in_marketplace(listing_type, listing_name)
    repo, team_name = self.find_feedback_recipient_info(FINANCIAL_ONBOARDING_SERVICE_NAME)
    team_name = FINANCIAL_ONBOARDING_TEAM_NAME
    if !repo
      return
    end
    if Rails.env.development?
      @user = User.find_by_login("monalisa")
    else
      @user = User.find_by_login(FINANCIAL_ONBOARDING_SERVICE_BOT)
    end
    issue_template = create_issue_from_state(listing_type, listing_name, team_name)
    @issue = Issue::Builder.new(@user, repo).build({issue: issue_template})
    @issue = self.add_label_and_team(listing_type, @issue, team_name)
    if @issue.save
      puts "saved issue"
      return
    else
      puts "not saved issue"
      return
    end
  end
```
* This method gets ownership information regrading `github/marketplace` repository from `ownership.yaml` file. This file contains information about all github internal repositories and teams
* It uses the `Marketplace-Bot` account to create an issue in the `github/marketplace` repository. It adds financial onboarding labels to the issue, tags the required the team in the issue body and creates issue using Issue::Builder.

1. For unverified apps initiating financial onboarding
* The `Marketplace::Listings::VerifiedApprovalRequestsController` class is used to change the state of app from `unverified` to `verification_pending_from_unverified` using the `initiate_financial_approval` method
* Within this method, we call `create_issue_in_marketplace` and `send_email_for_financial_onboarding` methods from FinancialOnboardingHelper module which are responsible for creating an issue in `github/marketplace` repository and sending an email to user with google form for collecting basic information for onboarding onto payment portal

The functionality of the `build_sort` method is as follows:
- Look for the `sort:field-order` string from the query phrase

  Example:
  ```
  :phrase => 'foo sort:created-desc'
  ```
- Return a tuple containing the field to sort on and the sort order.
  
  Example:
  ```
  :sort  => ['created', 'desc']
  ```
  
- Construct a sort section that can be used in the query doc.
  
  Example:
  ```
  build_sort_section( [‘created’, 'desc'] , SORT_MAPPINGS)
  => [{‘created_at’ => 'desc'}]
  ```
- Once the sort section is created, the corresponding key ('created_at') is matched with the index fields and the result is sorted based on the order specified ('desc').

## Implementation specifics
- The **challenge** with implementing sort in marketplace is - How to handle the sort field which could mean different things for different entities? 
  

- For example, sort by `popularity` i.e sort option on the dropdown `Most Installed/Starred` would imply different things for different entities. For apps, it should sort on `install_count` while for actions it should sort on `stars` (the field "popularity" is not an index field in either of these). 
  

- To resolve this, after the `build_sort_section` is created, the keyword "popularity" is replaced with the actual index field based on the entity queried for.
  ```
  :phrase => 'foo sort:popularity-desc'
  
  :sort  => [‘popularity’, 'desc']

  build_sort_section( [‘popularity’, 'desc'] , SORT_MAPPINGS)
  => [{‘popularity’ => 'desc'}]

  Replace popularity with actual entity identifier
  Example: If type is app,
  [{‘installation_count’ => 'desc'}]
  ```
  
  The following diagram explains the above flow:
<img width="1409" alt="Screenshot 2021-06-18 at 3 49 06 PM" src="https://user-images.githubusercontent.com/19996150/122546574-ba806280-d04c-11eb-81e5-a0d418ccf4d3.png">


- New field has been added to the `repository_actions` index to store the "stars" count for actions so that sorting on "Most Starred" can be achieved.

- A new view partial needs to be created for the "sort" dropdown display on the UI. This will be populated with the list of available sort options and the value of the same would map to what value we need to provide in the query (this will be visible in the updated query).
