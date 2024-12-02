FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app
COPY api/api.csproj ./
RUN dotnet restore
COPY api .
RUN dotnet build -c Release -o /out
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /out .
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "api.dll"]