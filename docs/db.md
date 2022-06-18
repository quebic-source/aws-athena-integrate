## authorizer-api
```
pk : auth-principle#<principle_id>
sk : auth-resource#<resource_path> eg: auth-resource#<appId>, auth-resource#<appId>/<locationId>
resourceId:
```

## roles-api
```
pk : role
sk : role-meta-data#<role_id>
```

## apps-api
```
pk : app#<app_id>
sk : app-meta-data#<app_name>
```

## locations-api
```
pk : location#<app_id>
sk : location-meta-data#<location_id>
```

## users-api
```
pk : user#<user_id>
sk : user-meta-data#<user_name>
```