# config.py
from configparser import ConfigParser

def load_config(filename='database.ini', section='postgresql'):
    parser = ConfigParser()
    parser.read(filename)

    config = {}
    if parser.has_section(section):
        params = parser.items(section)
        for param in params:
            config[param[0]] = param[1]
    else:
        # Fallback config if database.ini is missing
        config = {
            'host': 'localhost',
            'database': 'plant_db',
            'user': 'manish',
            'password': 'your_password_here'  # Replace with your actual password
        }
        print(f"Warning: Section '{section}' not found in '{filename}'. Using default config.")
    
    return config

if __name__ == '__main__':
    config = load_config()
    print(config)
