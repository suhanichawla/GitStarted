# Automation of Financial Onboarding Process

## Context 
The financial onboarding process allows users to publish paid plans for their app in marketplace. This process occurs when the user does one of the following: \
a. Requests publish on a draft app containing a paid plan \
b. Creates a paid plan on an unverified app and initiates financial onboarding 

Requirements:
1. Organization must be a verified publisher
2. The app applying for the marketplace listing must have 100 installs 

Present workflow \
![SequenceDiagramFO](https://user-images.githubusercontent.com/44273715/123704139-f7d1c500-d882-11eb-997d-fafecfc5da60.png)

## Intent
- Automating the issue creation when user requests to publish with a paid plan or initiates financial onboarding
- Sending an email to the user with a google form to collect some basic information required for the payment enrollment
- Automating issue conversation to save manual effort. More details on its implementation [here](https://docs.google.com/document/d/17H7cC11hBRxagedyR5eAVLRSz-tVa6_DYa-7tsRvskg/edit?usp=sharing)

Updated workflow \
![FlowWithBot (1)](https://user-images.githubusercontent.com/44273715/123704647-821a2900-d883-11eb-831b-a84da6822152.png)

## Implementation specifics

A new module `FinancialOnboardingHelper` has been created to provide helper functions for facilitating issue creation and sending email using MarketplaceMailer.

1. For draft apps applying to publish with paid plan

![Untitled Diagram](https://user-images.githubusercontent.com/44273715/123705946-3ec0ba00-d885-11eb-91b0-4a1cf8b76ba3.png)


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

2. For unverified apps initiating financial onboarding

![unverifiedappworkflow](https://user-images.githubusercontent.com/44273715/123706825-682e1580-d886-11eb-9140-d843c9b34ced.png)

* The `Marketplace::Listings::VerifiedApprovalRequestsController` class is used to change the state of app from `unverified` to `verification_pending_from_unverified` using the `initiate_financial_approval` method
* Within this method, we call `create_issue_in_marketplace` and `send_email_for_financial_onboarding` methods from FinancialOnboardingHelper module which are responsible for creating an issue in `github/marketplace` repository and sending an email to user respectively.
* The `send_email_for_financial_onboarding` method uses the `MarketplaceMailer` method `financial_onboarding_update` to send an email with a google form for collecting basic information for onboarding onto payment portal. The email is sent to technical lead and financial lead emails specified by the user in their the app listing

## Related Links
- Associated issue: https://github.com/github/marketplace/issues/2135
- Workflow reference (prior work): https://github.com/orgs/github/teams/engineering/discussions/373
- Associated PR: https://github.com/github/github/pull/184804

