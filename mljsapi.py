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
    Policies="AmazonDynamoDBFullAccess",
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
      ),
      "PostEvent": ApiEvent(
        "PostEvent",
        Path="/",
        Method="post"
      ),
      "OptionsEvent": ApiEvent(
        "OptionsEvent",
        Path="/",
        Method="options"
      )
    }
  )
)

# Protected Endpoint
t.add_resource(
  Function(
    "ProtectedEndpoint",
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
        Path="/protected-endpoint",
        Method="get"
      ),
      "PostEvent": ApiEvent(
        "PostEvent",
        Path="/protected-endpoint",
        Method="post"
      ),
      "OptionsEvent": ApiEvent(
        "OptionsEvent",
        Path="/protected-endpoint",
        Method="options"
      )
    }
  )
)

# Public Endpoint
t.add_resource(
  Function(
    "PublicEndpoint",
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
        Path="/public-endpoint",
        Method="get"
      ),
      "OptionsEvent": ApiEvent(
        "OptionsEvent",
        Path="/public-endpoint",
        Method="options"
      )
    }
  )
)

# Get Cookies
t.add_resource(
  Function(
    "GetCookies",
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
        Path="/get-cookies",
        Method="get"
      ),
      "OptionsEvent": ApiEvent(
        "OptionsEvent",
        Path="/get-cookies",
        Method="options"
      )
    }
  )
)

# Playground
t.add_resource(
  Function(
    "Playground",
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
        Path="/playground",
        Method="get"
      ),
      "OptionsEvent": ApiEvent(
        "OptionsEvent",
        Path="/playground",
        Method="options"
      )
    }
  )
)

# scripts
t.add_resource(
  Function(
    "Scripts",
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
        Path="/scripts",
        Method="get"
      ),
      "OptionsEvent": ApiEvent(
        "OptionsEvent",
        Path="/scripts",
        Method="options"
      )
    }
  )
)

# room-code
t.add_resource(
  Function(
    "RoomCode",
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
      "PostEvent": ApiEvent(
        "PostEvent",
        Path="/room-code",
        Method="post"
      ),
      "OptionsEvent": ApiEvent(
        "OptionsEvent",
        Path="/room-code",
        Method="options"
      )
    }
  )
)

# join-seder
t.add_resource(
  Function(
    "JoinSeder",
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
      "PostEvent": ApiEvent(
        "PostEvent",
        Path="/join-seder",
        Method="post"
      ),
      "OptionsEvent": ApiEvent(
        "OptionsEvent",
        Path="/join-seder",
        Method="options"
      )
    }
  )
)

# db
t.add_resource(
  Function(
    "DB",
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
      "PostEvent": ApiEvent(
        "PostEvent",
        Path="/db",
        Method="post"
      ),
      "OptionsEvent": ApiEvent(
        "OptionsEvent",
        Path="/db",
        Method="options"
      )
    }
  )
)

# roster
t.add_resource(
  Function(
    "Roster",
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
        Path="/roster",
        Method="get"
      ),
      "OptionsEvent": ApiEvent(
        "OptionsEvent",
        Path="/roster",
        Method="options"
      )
    }
  )
)

for line in t.to_yaml().splitlines():
  if not re.search(r'^\s*CodeUri:', line):
    print(line)
