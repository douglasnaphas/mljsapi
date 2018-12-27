import re
from troposphere import ImportValue, Join, Parameter, Ref, Template
from troposphere.awslambda import Environment
from troposphere.serverless import Function, ApiEvent

t = Template()
t.add_version('2010-09-09')
t.add_transform(['AWS::Serverless-2016-10-31', 'AWS::CodeStar'])
projectid = t.add_parameter(Parameter(
  "ProjectId",
  Description="AWS CodeStar projectID used to associate new resources to team members",
  Type="String"
))

# HelloWorld
t.add_resource(
  Function(
    "HelloWorld",
    Handler="index.handler",
    Runtime="nodejs8.10",
    CodeUri="this is not really required, as it is specified in buildspec.yml",
    Environment=Environment(
      Variables={
        "NODE_ENV": "production"
      }
    ),
    Role=ImportValue(
      Join("-", [Ref(projectid), Ref("AWS::Region"), "LambdaTrustRole"])
    ),
    Events={
      "GetEvent": ApiEvent(
        "GetEvent",
        Path="/",
        Method="get"
      )
    }
  )
)

# Protected Endpoint
t.add_resource(
  Function(
    "HelloWorld",
    Handler="index.handler",
    Runtime="nodejs8.10",
    CodeUri="this is not really required, as it is specified in buildspec.yml",
    Environment=Environment(
      Variables={
        "NODE_ENV": "production"
      }
    ),
    Role=ImportValue(
      Join("-", [Ref(projectid), Ref("AWS::Region"), "LambdaTrustRole"])
    ),
    Events={
      "GetEvent": ApiEvent(
        "GetEvent",
        Path="/",
        Method="get"
      )
    }
  )
)
for line in t.to_yaml().splitlines():
  if not re.search(r'^\s*CodeUri:', line):
    print(line)
