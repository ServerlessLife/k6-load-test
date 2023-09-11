USERNAME="guest"
PASSWORD="paSSword1!"
aws cognito-idp admin-create-user --user-pool-id $SST_Parameter_value_COGNITO_USER_POOL_ID --username $USERNAME --message-action SUPPRESS
aws cognito-idp admin-set-user-password --user-pool-id $SST_Parameter_value_COGNITO_USER_POOL_ID --username $USERNAME --password $PASSWORD --permanent