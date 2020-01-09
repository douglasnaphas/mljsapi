import re
from troposphere import ImportValue, Join, Parameter, Ref, Template
from troposphere.awslambda import Environment
from troposphere.serverless import Function, ApiEvent

t = Template()

t.set_version('2010-09-09')
t.set_transform(['AWS::Serverless-2016-10-31', 'AWS::CodeStar'])
projectid = t.add_parameter(Parameter(
  "ProjectId",
  Description="AWS CodeStar projectID used to associate new resources to team members",
  Type="String"
))

def events(path, get, post, options):
  ev = {"Events": {}}
  if get:
    ev["Events"]["GetEvent"] = ApiEvent("GetEvent", Path=path, Method="get")
  if post:
    ev["Events"]["PostEvent"] = ApiEvent("PostEvent", Path=path, Method="post")
  if options:
    ev["Events"]["OptionsEvent"] = \
      ApiEvent("OptionsEvent", Path=path, Method="options")
  return ev
def add_function(template, name, path, db_access=False, get=False, post=False,
  options=False, timeout=None, memory_size=None):
  common_function_args = {
    "Handler": "index.handler",
    "Runtime": "nodejs12.x",
    "CodeUri": "this is not really required, as it is specified in buildspec.yml",
    "Environment": Environment(
      Variables={
        "NODE_ENV": "production"
      }
    ),
    "Role": ImportValue(
      Join("-", [Ref(projectid), Ref("AWS::Region"), "LambdaTrustRole"])
  )}
  common_args_db_access = {
    **common_function_args,
    "Policies": "AmazonDynamoDBFullAccess",
  }
  common_args = {}
  if db_access:
    common_args = common_args_db_access
  else:
    common_args = common_function_args
  if timeout:
    common_args["Timeout"] = timeout
  if memory_size:
    common_args["MemorySize"] = memory_size
  template.add_resource(
    Function(
      name,
      **common_args,
      **events(path, get=get, post=post, options=options)
    )
  )

add_function(t, "HelloWorld", path="/", db_access=True, get=True, post=True,
  options=True)
add_function(t, "ProtectedEndpoint", path="/protected-endpoint", get=True,
  post=True, options=True)
add_function(t, "PublicEndpoint", path="/public-endpoint", get=True,
  options=True, timeout=5)
add_function(t, "GetCookies", path="/get-cookies", timeout=30, memory_size=1792,
  get=True, options=True)
add_function(t, "Playground", path="/playground", timeout=30, get=True,
  options=True)
add_function(t, "Scripts", path="/scripts", timeout=30, memory_size=1792,
  get=True, options=True)


# room-code
t.add_resource(
  Function(
    "RoomCode",
    Handler="index.handler",
    Runtime="nodejs8.10",
    Timeout=40,
    MemorySize=3008,
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
    Timeout=30,
    MemorySize=1792,
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
    Timeout=10,
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
        Path="/db",
        Method="get"
      ),
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
    Timeout=40,
    MemorySize=3008,
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

# close-seder
t.add_resource(
  Function(
    "CloseSeder",
    Handler="index.handler",
    Runtime="nodejs8.10",
    Timeout=40,
    MemorySize=3008,
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
        Path="/close-seder",
        Method="post"
      ),
      "OptionsEvent": ApiEvent(
        "OptionsEvent",
        Path="/close-seder",
        Method="options"
      )
    }
  )
)

# play
t.add_resource(
  Function(
    "Play",
    Handler="index.handler",
    Runtime="nodejs8.10",
    Timeout=5,
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
        Path="/play",
        Method="get"
      ),
      "PostEvent": ApiEvent(
        "PostEvent",
        Path="/play",
        Method="post"
      ),
      "OptionsEvent": ApiEvent(
        "OptionsEvent",
        Path="/play",
        Method="options"
      )
    }
  )
)

# assignments
t.add_resource(
  Function(
    "Assignments",
    Handler="index.handler",
    Runtime="nodejs8.10",
    Timeout=60,
    MemorySize=3008,
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
        Path="/assignments",
        Method="get"
      ),
      "OptionsEvent": ApiEvent(
        "OptionsEvent",
        Path="/assignments",
        Method="options"
      )
    }
  )
)

# submit-libs
t.add_resource(
  Function(
    "SubmitLibs",
    Handler="index.handler",
    Runtime="nodejs8.10",
    Timeout=40,
    MemorySize=3008,
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
        Path="/submit-libs",
        Method="post"
      ),
      "OptionsEvent": ApiEvent(
        "OptionsEvent",
        Path="/submit-libs",
        Method="options"
      )
    }
  )
)

# read-roster
t.add_resource(
  Function(
    "ReadRoster",
    Handler="index.handler",
    Runtime="nodejs8.10",
    Timeout=60,
    MemorySize=3008,
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
        Path="/read-roster",
        Method="get"
      ),
      "OptionsEvent": ApiEvent(
        "OptionsEvent",
        Path="/read-roster",
        Method="options"
      )
    }
  )
)

# script
t.add_resource(
  Function(
    "Script",
    Handler="index.handler",
    Runtime="nodejs8.10",
    Timeout=80,
    MemorySize=1792,
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
        Path="/script",
        Method="get"
      ),
      "OptionsEvent": ApiEvent(
        "OptionsEvent",
        Path="/script",
        Method="options"
      )
    }
  )
)


for line in t.to_yaml().splitlines():
  if not re.search(r'^\s*CodeUri:', line):
    print(line)
