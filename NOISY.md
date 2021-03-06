# dash-core-components Fork

## Motivation

The only correct way to build the entire dash stack is via the
dash project's circleci build, but that config pulls dash components
from github indiscriminately, making builds of earlier builds impossible
without some fragile config hackery.

Instead, the dash, dash-table, dash-html-components, and dash-core-components
projects have been forked by noisycomputation. The default `noisy` branch of
all the projects points to currently supported mutually-compatible versions
of theproject, and the dash project's circleci config has been modified
to pull in the forks, build them, and publish the resulting packages on
the publicly available python repository <https://noisycomputation.github.io>.
The convention for these forks is to use the very next patch number from
the version on which they are based with a `-a1` suffix:

> Example: upstream v1.2.3 becomes v1.2.4-a1.

The suffix specifies a pre-release of the next patch version consistent with both
Python's [PEP 440](https://www.python.org/dev/peps/pep-0440/#id28) and
Node's [semver](https://github.com/semver/semver/blob/master/semver.md).
The next patch's pre-release was chosen to avoid version conflicts with
upstream, for instance if upstream v1.2.3 were to be forked as v1.2.4,
upstream's subsequent release of v1.2.4 would conflict with the noisycomputation
version.

Projects wishing to use the forked noisycomputation packages need to list the
<https://noisycomputation.github.io>  repository as an extra install URL in
the `pip` vernacular and to pin the dependency to the exact version used by
noisycomputation.

> Care must be taken to list these dependencies *before* any
> other dependencies that might pull the upstream packages. For example, the
> package `dash-bootstrap-components` lists `dash>=1.9.0` as a dependency.
> If the noisycomputation version of `dash` is listed first, it will be
> installed from the noisycomputation repo and will satisfy the
> `dash-bootstrap-components` dependency.

## Build Instructions

Build only using the top-level dash project's circleci method, otherwise
there is no guarantee that the build is reproducible or that it passes the
battery of integration tests that only exist in the dash project.

## Fixing Javascript Dependencies

Fixing Javascript dependencies is painful, because it requires a local
node environment to be created, versioned correctly, and activated.

First, determine which node version the circleci Docker image specified
in `.circleci/config.yml` uses. For example, if the image specification
is `circleci/python:3.7-stretch-node-browsers`, go to
<https://hub.docker.com/r/circleci/python/tags> and enter the tag into
the search bar, which in this case is `3.7-stretch-node-browsers`. Click
on the appropriate image tag, and search the next screen for `NODE_VERSION`.
In this example, the version is `12.18.0`.

Next, use nodeenv to generate a python + node virtual environment one
directory level above the repo:

    ```
    python -m venv venv
    source venv/bin/activate
    pip install -U pip; pip install nodeenv
    nodeenv --node=12.18.0 -p
    ```

Make the necessary changes to `package.json`, then delete `package-lock.json`
and, if it exists, `node-modules/`. Run `npm install` to generate a new
`package-lock.json`. If it worked, delete `node-modules/`, and git add+commit.

## Branch Policy

The branch `noisy` always points to the commit that should be built. All the
noisycomputation forks of dash project need to have their `noisy` branches set
to a compatible set of commits.

To find a compatible set of commits for a dash version, first set the `dash`
fork's `noisy` branch to the appropriate commit. For example, to build `dash`
at tag v1.11.0, create a new branch from that release:

    git checkout -b noisy-v1.11.0.post13 v1.11.0

Make any desired changes, commit as many times as you like, make sure to
change the version to `1.11.0.post13`. When ready to build,
point the `noisy` branch to the desired commit and forcibly point `noisy` to
the appropriate commit:

    git branch -vv (note the commit ID of the branch noisy should point to)
    git checkout noisy
    git reset --hard {commit ID}
    git push origin --force

When committing changes, make sure to omit lint verification, since there is
a husky commit hook defined, but it requires a full development environment:

    git commit --no-verify

#### Changelog (individual version motivations)

* v1.9.2-a1

    * fix Javascript dependencies

   core/environment/index.ts:

    * changed `ACTIVE_EDGE` to `var(--active_edge)`
