# Generated by Django 5.1 on 2024-09-11 18:58

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('spotify', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='spotifytoken',
            old_name='user',
            new_name='username',
        ),
    ]
