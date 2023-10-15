# Contributing


##  Pre-requisites
- [Node.js](https://nodejs.org/en/download/)
- [Git](https://git-scm.com/downloads)
- [Rockcraft](https://snapcraft.io/rockcraft)


## Development

```bash
git clone https://github.com/gruyaume/cognitive-profile.git
cd cognitive-profile
npm install
npm run dev
```

## Container image

```bash
rockcraft pack -v
version=$(yq '.version' rockcraft.yaml)
sudo skopeo --insecure-policy copy oci-archive:cognitive-profile_${version}_amd64.rock docker-daemon:cognitive-profile:${version}
docker run -p 3000:3000 cognitive-profile:${version}
```
