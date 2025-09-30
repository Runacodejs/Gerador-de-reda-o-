{ pkgs, ... }: {
  channel = "stable-24.05";
  packages = [
    pkgs.nodejs_20
  ];
  env = {
    API_KEY = "AIzaSyAX0W7ac_DarvIqaHiiZd-9msnzF8aeacQ";
  };
  idx = {
    extensions = [
    ];
    previews = {
      enable = true;
      previews = {
        web = {
          command = ["npm" "install" "&&" "npm" "start"];
          manager = "web";
          env = {
            PORT = "$PORT";
          };
        };
      };
    };
    workspace = {
      onCreate = {
      };
      onStart = {
      };
    };
  };
}
