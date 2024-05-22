# refurbishedWeb-Backend
refurbishedWeb Backend

## Unused folders
events folder is not used.

# AWS SAM documentation

This project contains source code and supporting files for a serverless application that you can deploy with the SAM CLI.These production resources and development resources are defined in the `templates/template.yaml` file and `templates/template_dev.yaml` file, respectively. You can update the template to add AWS resources through the same deployment process that updates your application code.

If you prefer to use an integrated development environment (IDE) to build and test your application, you can use the AWS Toolkit.  
The AWS Toolkit is an open source plug-in for popular IDEs that uses the SAM CLI to build and deploy serverless applications on AWS. The AWS Toolkit also adds a simplified step-through debugging experience for Lambda function code. See the following links to get started.

* [CLion](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
* [GoLand](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
* [IntelliJ](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
* [WebStorm](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
* [Rider](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
* [PhpStorm](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
* [PyCharm](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
* [RubyMine](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
* [DataGrip](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
* [VS Code](https://docs.aws.amazon.com/toolkit-for-vscode/latest/userguide/welcome.html)
* [Visual Studio](https://docs.aws.amazon.com/toolkit-for-visual-studio/latest/user-guide/welcome.html)

## Build the Application

The Serverless Application Model Command Line Interface (SAM CLI) is an extension of the AWS CLI that adds functionality for building and testing Lambda applications. It uses Docker to run your functions in an Amazon Linux environment that matches Lambda. It can also emulate your application's build environment and API.

To use the SAM CLI, you need the following tools.

* SAM CLI - [Install the SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
* AWS CLI - [Install the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
* [Python 3 installed](https://www.python.org/downloads/)
* Docker - [Install Docker community edition](https://hub.docker.com/search/?type=edition&offering=community)

To build your application for the first time, run the following in your shell:

```bash
sam build -t template_dev.yaml --cached # Builds for development environment, which is what you will be testing on
```

The command will build the source of your application. 

## Test Locally

The SAM CLI can emulate your application's API. After building the application with `sam build`, use the `sam local start-api` to run the API locally on port 3031.

```bash
$ sam local start-api -d 5858 -p 3031 --profile <the name of your aws profile>
```

The SAM CLI reads the application template to determine the API's routes and the functions that they invoke. The `Events` property on each function's definition includes the route and method for each path.

```yaml
      Events:
        HelloWorld:
          Type: Api
          Properties:
            Path: /hello
            Method: get
```

## Deploy the Application

After building and testing the application locally, it is now the time to deploy the application. To do so, you will first [set up the AWS credential](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-getting-started-set-up-credentials.html) on your computer. 

Then type in the following command (if there is only one profile on your computer, you can omit the "--profile" part in the command):

```bash
sam deploy --profile <the name of your aws profile> --guided --capabilities CAPABILITY_NAMED_IAM
```

The command will package and deploy your application to AWS, with a series of prompts:

* **Stack Name**: The name of the stack to deploy to CloudFormation. Please use "dev" as the stack name.
* **AWS Region**: The AWS region you want to deploy your app to.
* **Confirm changes before deploy**: If set to yes, any change sets will be shown to you before execution for manual review. If set to no, the AWS SAM CLI will automatically deploy application changes.
* **Allow SAM CLI IAM role creation**: Many AWS SAM templates, including this example, create AWS IAM roles required for the AWS Lambda function(s) included to access AWS services. By default, these are scoped down to minimum required permissions. To deploy an AWS CloudFormation stack which creates or modifies IAM roles, the `CAPABILITY_IAM` value for `capabilities` must be provided. If permission isn't provided through this prompt, to deploy this example you must explicitly pass `--capabilities CAPABILITY_IAM` to the `sam deploy` command.
* **Save arguments to samconfig.toml**: If set to yes, your choices will be saved to a configuration file inside the project, so that in the future you can just re-run `sam deploy` without parameters to deploy changes to your application.

You can find your API Gateway Endpoint URL in the output values displayed after deployment.
You may removed the --guided flag in the second command after your very first successful deploy.

## Deploy the RDS Database
If you've added scripts to sql/sql_scripts, then run the following command to deploy:

```bash
$ AWS_PROFILE=<the name of your aws profile> python sql/deploy_database_changes.py
```

## Add Resource to Your Application
The application template uses AWS Serverless Application Model (AWS SAM) to define application resources. AWS SAM is an extension of AWS CloudFormation with a simpler syntax for configuring common serverless application resources such as functions, triggers, and APIs. For resources not included in [the SAM specification](https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md), you can use standard [AWS CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-template-resource-type-ref.html) resource types.

## Fetch, Tail, and Filter Lambda Function Logs

To simplify troubleshooting, SAM CLI has a command called `sam logs`. `sam logs` lets you fetch logs generated by your deployed Lambda function from the command line. In addition to printing the logs on the terminal, this command has several nifty features to help you quickly find the bug.

`NOTE`: This command works for all AWS Lambda functions; not just the ones you deploy using SAM.

```bash
$ sam logs -n HelloWorldFunction --stack-name dev --tail
```

You can find more information and examples about filtering Lambda function logs in the [SAM CLI Documentation](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-logging.html).

## Tests

Tests are defined in the `tests` folder in this project. Use PIP to install the test dependencies and run tests.

```bash
$ pip install -r tests/requirements.txt --user
# unit test
$ AWS_PROFILE=<the name of your aws profile> python -m pytest tests/unit -v
# integration test, requiring deploying the stack first.
# Create the env variable AWS_SAM_STACK_NAME with the name of the stack we are testing
$ AWS_PROFILE=<the name of your aws profile> AWS_SAM_STACK_NAME=<stack-name> python -m pytest tests/integration -v
```

## MySQL Workbench
Sometimes you may want to write and test SQL. To do that, first create a script under sql/sql_scripts, naming it as [the-next–greater-number].sql. Then, create a connection in MySQL Workbench with the following credential: 
* Host: alumly-sql-instance.cs5khcwuuzzj.us-east-1.rds.amazonaws.com
* Username: opsworksuser
* Password: cO2veGFkeSnrTPO0VB1d
Connect to the database, open the script you've just created, and you can go from there!

## Resources

See the [AWS SAM developer guide](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html) for an introduction to SAM specification, the SAM CLI, and serverless application concepts.

Next, you can use AWS Serverless Application Repository to deploy ready to use Apps that go beyond hello world samples and learn how authors developed their applications: [AWS Serverless Application Repository main page](https://aws.amazon.com/serverless/serverlessrepo/)

##content Management System (CMS)

- **WordPress with WooCommerce**: A popular choice for e-commerce sites due to its extensive plugin ecosystem and ease of use.
- **Shopify**: A fully hosted solution that provides a wide range of e-commerce features out-of-the-box.

##E-commerce Platform**

**Plugins:**
- **WooCommerce** (for WordPress): For managing products, carts, and orders.
- **Stripe or PayPal APIs**: For handling payments securely.
![image](https://github.com/refurbishedWeb/backend/assets/91359766/0249eb61-7ef1-494e-8943-297c6c023be7)

