npm run build 
tar -czvf dist.tar.gz dist
ssh atik@gcloud 'rm -rf /tmp/tekiz*'
ssh atik@gcloud 'mkdir /tmp/tekiz && mkdir /tmp/tekiz-dist'
scp dist.tar.gz atik@gcloud:/tmp/tekiz
ssh atik@gcloud 'tar -xzvf /tmp/tekiz/dist.tar.gz -C /tmp/tekiz-dist'
ssh atik@gcloud 'sudo rm -rf /usr/share/nginx/html/*'
ssh atik@gcloud 'sudo mv /tmp/tekiz-dist/dist/* /usr/share/nginx/html'
ssh atik@gcloud 'rm -rf /tmp/tekiz*'
rm -rf dist.tar.gz