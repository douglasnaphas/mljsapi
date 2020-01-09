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
add_function(t, "RoomCode", path="/room-code", timeout=40, memory_size=3008,
  post=True, options=True)
add_function(t, "JoinSeder", path="/join-seder", timeout=30, memory_size=1792,
  post=True, options=True)
add_function(t, "DB", path="/db", timeout=10, get=True, post=True, options=True)
add_function(t, "Roster", path="/roster", timeout=40, memory_size=3008,
  get=True, options=True)
add_function(t, "CloseSeder", path="/close-seder", timeout=40,
  memory_size=3008, post=True, options=True)
add_function(t, "Play", path="/play", timeout=5, get=True, post=True,
  options=True)
add_function(t, "Assignments", path="/assignments", timeout=60,
  memory_size=3008, get=True, options=True)
add_function(t, "SubmitLibs", path="/submit-libs", timeout=40,
  memory_size=3008, post=True, options=True)
add_function(t, "ReadRoster", path="/read-roster", timeout=60,
  memory_size=3008, get=True, options=True)
add_function(t, "Script", path="/script", timeout=80, memory_size=1792,
  get=True, options=True)

for line in t.to_yaml().splitlines():
  if not re.search(r'^\s*CodeUri:', line):
    print(line)
