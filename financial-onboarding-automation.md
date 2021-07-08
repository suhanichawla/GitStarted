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
- Performing webhook checks directly from github.com and automatically sending email with financial onboarding form
- Updating issue with status of webhook checks and form sending procedure

## Approach
The automation process has two sequencial steps
1. Creation of issue on marketplace repository
2. Running a background job (Financial Onboarding Job) to perform webhook checks and updating listing status on the issue
A new module `FinancialOnboardingDependency` has been created to provide helper functions for facilitating issue creation and running Financial Onboarding Job.
We will listen to `request_verified_approval` on draft and unverified listings. 
Here we will consider two cases:
- When a transition takes place from from `draft` state to `verification_pending_from_draft` state for draft listing
- When a transition takes place from from `unverified` state to `:verification_pending_from_unverified` state for unverified listing \
In both these cases, we will call `initiate_financial_onboarding` declared in `FinancialOnboardingDependency` module. This will create an issue in the marketplace repository as well an enqueue a new background job `FinancialOnboardingJob` which will perform webhook check on the listing, send email to user if check is successful and update issue with the current status of the listing.
Here is the updated workflow after the automation

Updated workflow \
![FlowWithAutomation](https://user-images.githubusercontent.com/44273715/124869144-6e3a9980-dfde-11eb-82b6-bf7179d05a86.png)


## Implementation specifics

Let's talk about the two main processes in detail:
1. Issue creation
![issuecreation](https://user-images.githubusercontent.com/44273715/124970834-0cae1580-e046-11eb-8fa9-6e282c09cc37.png)

The issue creation process involves the following steps
1. Find `github/marketplace` repository on github
2. Find a template issue on `marketplace` repository. Clone the issue and update its contents to add current listing information
3. Add correct label on the issue. If the listing is requesting publish from draft state add the `financial-onboarding-draft` label. If the listing is initiating financial onboarding from unverified state, add the `financial-onboarding-unverified` label
4. Save and create the issue

If the process fails at any point, we log an error in splunk 

2. Financial Onboarding Job

Associated inputs: 
hook, issue_id, listing_type, mailer_params

![Financial Onboarding Job (1)](https://user-images.githubusercontent.com/44273715/124971857-53503f80-e047-11eb-878a-7a82a0f1a3a4.png)

The financial onboarding job is responsible for 
a. Performing webhook checks on the listing
b. Sending email to user if check is successful 
c. Updating status of listing on the created issue

* The `send_email_for_financial_onboarding` method uses the `MarketplaceMailer` method `financial_onboarding_update` to send an email with a google form for collecting basic information for onboarding onto payment portal. The email is sent to technical lead and financial lead emails specified by the user in their the app listing

## Testing in dev environment
To test the changes in dev environment following setup is required:
1. Log into the dev environment with `monalisa` test account
2. Create a private repository by the name of `marketplace` under `github` organization
3. Create two template issues on this repository, one containing template for draft listing applying for financial onboarding (sample) and another for unverified listing applying for financial onboarding (sample) and note their issue numbers
4. Go to `financial-onboarding-dependency.rb` file in `app/models/marketplace` and replace the issue numbers by your newly created issue numbers for draft and unverified listing respectively
5. Now that the setup is done, create a new organization, create a new github app, list the app in marketplace and request publish with this app with a paid plan 
The marketplace repository should be updated with a newly created issue with your app listing details

## Future Enhancements
1. Slack notification on `marketplace-engg` or similar marketplace support channel if issue creation fails
2. The process of marking various checks as completed in the tasklist of issue description is based on position of the task, more specifically on its relative ordering the in the checklist in issue body. We can figure out am approach to make the tasklist implementation independent of the position of the check, thus allowing us to modify the issue template freely

## Related Links
- Associated issue: https://github.com/github/marketplace/issues/2135
- Workflow reference (prior work): https://github.com/orgs/github/teams/engineering/discussions/373
- Associated PR: https://github.com/github/github/pull/184804

