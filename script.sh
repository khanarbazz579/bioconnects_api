project_dir="{project_dir_path}"

if [ ! -d $project_dir ] 
then 
    mkdir $project_dir
fi

cd $project_dir

if [ ! "$(ls -A . )" ]
then
    git clone {repo_url} .
fi