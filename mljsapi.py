import re
from troposphere import ImportValue, Join, Parameter, Ref, Template
from troposphere.awslambda import Environment
from troposphere.serverless import Function, ApiEvent

t = Template()
dt = Template()

for template in [t, dt]:  
  template.set_version('2010-09-09')
  template.set_transform(['AWS::Serverless-2016-10-31', 'AWS::CodeStar'])
projectid = t.add_parameter(Parameter(
  "ProjectId",
  Description="AWS CodeStar projectID used to associate new resources to team members",
  Type="String"
))
dt.add_parameter(Parameter(
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
  options=False, timeout=None, memory_size=None, node_env="production"):
  common_function_args = {
    "Handler": "index.handler",
    "Runtime": "nodejs12.x",
    "CodeUri": "this is not really required, as it is specified in buildspec.yml",
    "Environment": Environment(
      Variables={
        "NODE_ENV": node_env,
        "TABLE_NAME": "seders",
        "JWKS_URL": "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_Yn89yKizn/.well-known/jwks.json",
        "COGNITO_CLIENT_ID": "25h54vd0cundt7iaeon1rn8a02",
        "COGNITO_USER_POOL_ID": "us-east-1_Yn89yKizn",
        "COGNITO_TOKEN_ENDPOINT_URL": "https://madliberationfederated.auth.us-east-1.amazoncognito.com/oauth2/token",
        "COGNITO_DEFAULT_REDIRECT_URI": "https://api.passover.lol/get-cookies"
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

for fn in [
    {"node_env": "production", "template": t},
    {"node_env": "development", "template": dt}
  ]:
  add_function(fn["template"], "HelloWorld", node_env=fn["node_env"], path="/", db_access=True, get=True, post=True,
    options=True)
  add_function(fn["template"], "PublicEndpoint", node_env=fn["node_env"], path="/public-endpoint", get=True,
    options=True, timeout=5)
  add_function(fn["template"], "GetCookies", node_env=fn["node_env"], path="/get-cookies", timeout=30, memory_size=1792,
    get=True, options=True)
  add_function(fn["template"], "Id", node_env=fn["node_env"], path="/id", timeout=30, memory_size=3008,
    get=True, options=True)
  add_function(fn["template"], "Playground", node_env=fn["node_env"], path="/playground", timeout=30, get=True,
    options=True)
  add_function(fn["template"], "Scripts", node_env=fn["node_env"], path="/scripts", timeout=30, memory_size=1792,
    get=True, options=True)
  add_function(fn["template"], "RoomCode", node_env=fn["node_env"], path="/room-code", timeout=40, memory_size=3008,
    post=True, options=True)
  add_function(fn["template"], "JoinSeder", node_env=fn["node_env"], path="/join-seder", timeout=30, memory_size=1792,
    post=True, options=True)
  add_function(fn["template"], "DB", node_env=fn["node_env"], path="/db", timeout=10, get=True, post=True, options=True)
  add_function(fn["template"], "Roster", node_env=fn["node_env"], path="/roster", timeout=40, memory_size=3008,
    get=True, options=True)
  add_function(fn["template"], "CloseSeder", node_env=fn["node_env"], path="/close-seder", timeout=40,
    memory_size=3008, post=True, options=True)
  add_function(fn["template"], "Play", node_env=fn["node_env"], path="/play", timeout=5, get=True, post=True,
    options=True)
  add_function(fn["template"], "Assignments", node_env=fn["node_env"], path="/assignments", timeout=60,
    memory_size=3008, get=True, options=True)
  add_function(fn["template"], "SubmitLibs", node_env=fn["node_env"], path="/submit-libs", timeout=40,
    memory_size=3008, post=True, options=True)
  add_function(fn["template"], "ReadRoster", node_env=fn["node_env"], path="/read-roster", timeout=60,
    memory_size=3008, get=True, options=True)
  add_function(fn["template"], "Script", node_env=fn["node_env"], path="/script", timeout=80, memory_size=1792,
    get=True, options=True)
  add_function(fn["template"], "Seders", node_env=fn["node_env"], path="/seders", timeout=30, memory_size=3008,
    post=True, get=True, options=True)
  add_function(fn["template"], "SedersStarted", node_env=fn["node_env"], path="/seders-started", timeout=30, memory_size=3008,
    get=True, options=True)
  add_function(fn["template"], "SedersJoined", node_env=fn["node_env"], path="/seders-joined", timeout=30, memory_size=3008,
    get=True, options=True)
  add_function(fn["template"], "Rejoin", node_env=fn["node_env"], path="/rejoin", timeout=30, memory_size=3008,
    post=True, options=True)

with  open("template.yml", "w") as template_yml, \
      open("dev-template.yml", "w") as dev_template_yml:
  for line in t.to_yaml().splitlines():
    if not re.search(r'^\s*CodeUri:', line):
      template_yml.write(line + "\n")
  for line in dt.to_yaml().splitlines():
    if not re.search(r'^\s*CodeUri:', line):
      dev_template_yml.write(line + "\n")

